import numpy as np
import pandas as pd


def clean(vehicles: pd.DataFrame, municipalities: dict) -> pd.DataFrame:
    # Registration year
    vehicles["registration_date"] = pd.to_datetime(
        vehicles["registration_date"],
        format="%Y-%m-%d",
        cache=True,
        exact=True,
        yearfirst=True,
        errors="coerce",
    )

    vehicles["intro_year"] = (
        pd.to_numeric(vehicles["intro_date"].str[:4], errors="coerce")
        .fillna(0)
        .astype("Int16")
    )
    vehicles["registration_year"] = (
        vehicles["registration_date"]
        .dt.year.fillna(vehicles["intro_year"])
        .astype("Int16")
    )

    # Older than 1980 reduced to 1979
    vehicles.loc[vehicles["registration_year"] < 1980, "registration_year"] = 1979

    # Municipalities, map unmatched to 999 Unknown
    vehicles["municipality"] = np.where(
        vehicles["municipality"].isin(municipalities.keys()),
        vehicles["municipality"],
        "999",
    )

    # Driving force grouping
    vehicles["is_hybrid"] = vehicles["is_hybrid"].str.lower()
    vehicles["is_hybrid"] = vehicles["is_hybrid"] == "true"

    driving_force_map = {
        "01": "petrol",
        "02": "diesel",
        "04": "electricity",
    }

    vehicles["driving_force"] = (
        vehicles["driving_force"].map(driving_force_map).fillna("other")
    )
    vehicles["driving_force"] = np.where(
        vehicles["is_hybrid"], "hybrid", vehicles["driving_force"]
    )

    # Color grouping
    color_map = {
        "0": "black",
        "1": "brown",
        "2": "red",
        "5": "green",
        "6": "blue",
        "8": "grey",
        "9": "white",
        "Y": "silver",
    }

    vehicles["color"] = vehicles["color"].map(color_map).fillna("other")

    # Mileage
    vehicles["mileage"] = (
        pd.to_numeric(vehicles["mileage"], errors="coerce")
        .fillna(-1)  # If not available
        .clip(upper=5_000_000)  # To cap ridiculous amounts
        .astype("Int32")
    )

    # Makers more unique
    vehicles["maker_text"] = vehicles["maker_text"].fillna("").str.lower()

    # Makers grouping
    maker_map = {
        "alfa": "Alfa Romeo",
        "alfa romeo": "Alfa Romeo",
        "aston martin": "Aston Martin",
        "audi": "Audi",
        "bmw": "BMW",
        "cadillac": "Cadillac",
        "chevrolet": "Chevrolet",
        "chrysler": "Chrysler",
        "citroen": "Citroën",
        "cupra": "Cupra",
        "dacia": "Dacia",
        "datsun": "Datsun",
        "dodge": "Dodge",
        "ferrari": "Ferrari",
        "fiat": "Fiat",
        "ford": "Ford",
        "honda": "Honda",
        "hyundai": "Hyundai",
        "jaguar": "Jaguar",
        "jeep": "Jeep",
        "kia": "Kia",
        "lada": "Lada",
        "lamborghini": "Lamborghini",
        "land rover": "Land Rover",
        "lexus": "Lexus",
        "Maserati": "Maserati",
        "mazda": "Mazda",
        "mercedes": "Mercedes-Benz",
        "mini": "Mini",
        "mitsubishi": "Mitsubishi",
        "nissan": "Nissan",
        "opel": "Opel",
        "peugeot": "Peugeot",
        "porsche": "Porsche",
        "polestar": "Polestar",
        "renault": "Renault",
        "saab": "Saab",
        "seat": "Seat",
        "skoda": "Škoda",
        "smart": "Smart",
        "subaru": "Subaru",
        "suzuki": "Suzuki",
        "tesla": "Tesla",
        "toyota": "Toyota",
        "volkswagen": "Volkswagen",
        "vw": "Volkswagen",
        "volvo": "Volvo",
    }

    def group_maker(maker):
        for prefix, target in maker_map.items():
            if maker.startswith(prefix):
                return target
        return "Other"

    vehicles["maker"] = vehicles["maker_text"].map(group_maker)

    vehicles.drop(
        labels=["registration_date", "intro_date", "intro_year", "is_hybrid"],
        axis=1,
        inplace=True,
    )

    return vehicles


def generate(df: pd.DataFrame, municipalities: dict, date: str) -> dict:
    # Groupings
    bin_size = 50_000
    bins = (
        [-1, 0] + list(range(bin_size, 600_001, bin_size)) + [df["mileage"].max() + 1]
    )
    labels = (
        ["na"]
        + [f"under{bin_size // 1000}k"]
        + [f"{i // 1000}kto{j // 1000}k" for i, j in zip(bins[2:-2], bins[3:-1])]
        + [f"over{bins[-2] // 1000}k"]
    )
    df["mileage_group"] = pd.cut(
        df["mileage"], bins=bins, labels=labels, right=False, include_lowest=True
    )

    grouped_mileage = (
        df.groupby(["mileage_group", "municipality"], observed=True)
        .size()
        .reset_index(name="count")
    )

    grouped_driving = (
        df.groupby(["driving_force", "municipality"], observed=True)
        .size()
        .reset_index(name="count")
    )
    grouped_color = (
        df.groupby(["color", "municipality"], observed=True)
        .size()
        .reset_index(name="count")
    )
    grouped_maker = (
        df.groupby(["maker", "municipality"], observed=True)
        .size()
        .reset_index(name="count")
    )
    grouped_year = (
        df.groupby(["registration_year", "municipality"], observed=True)
        .size()
        .reset_index(name="count")
    )

    # Count for municipalities
    driving_forces = set(grouped_driving["driving_force"])
    colors = set(grouped_color["color"])
    years = set(grouped_year["registration_year"])
    makers = set(grouped_maker["maker"])

    final = []
    for municipality_code, group in grouped_driving.groupby("municipality"):
        # Mileages
        mileage_group = grouped_mileage[
            grouped_mileage["municipality"] == municipality_code
        ]
        mileage_counts = dict(
            zip(mileage_group["mileage_group"], mileage_group["count"])
        )

        # Driving forces
        driving_force_counts = dict(zip(group["driving_force"], group["count"]))
        for driving_force in driving_forces:
            if driving_force not in driving_force_counts:
                driving_force_counts[driving_force] = 0

        # Colors
        color_group = grouped_color[grouped_color["municipality"] == municipality_code]
        color_counts = dict(zip(color_group["color"], color_group["count"]))
        for color in colors:
            if color not in color_counts:
                color_counts[color] = 0

        # Registration years
        year_group = grouped_year[grouped_year["municipality"] == municipality_code]
        year_counts = dict(zip(year_group["registration_year"], year_group["count"]))
        year_counts_str = {str(year): count for year, count in year_counts.items()}

        # Makers
        maker_group = grouped_maker[grouped_maker["municipality"] == municipality_code]
        maker_counts = dict(zip(maker_group["maker"], maker_group["count"]))

        final.append(
            {
                "code": municipality_code,
                "name": municipalities[municipality_code],
                "mileageCount": mileage_counts,
                "drivingForceCount": driving_force_counts,
                "colorCount": color_counts,
                "registrationYearCount": year_counts_str,
                "makerCount": maker_counts,
            }
        )

    # Totals
    total_mileage_counts = {}
    total_driving_force_counts = {driving_force: 0 for driving_force in driving_forces}
    total_color_counts = {color: 0 for color in colors}
    total_year_counts = {str(year): 0 for year in years}
    total_maker_counts = {maker: 0 for maker in makers}

    for municipality in final:
        for mileage, count in municipality["mileageCount"].items():
            if mileage in total_mileage_counts:
                total_mileage_counts[mileage] += count
            else:
                total_mileage_counts[mileage] = count

        for driving_force, count in municipality["drivingForceCount"].items():
            total_driving_force_counts[driving_force] += count

        for color, count in municipality["colorCount"].items():
            total_color_counts[color] += count

        for year, count in municipality["registrationYearCount"].items():
            total_year_counts[year] += count

        for maker, count in municipality["makerCount"].items():
            total_maker_counts[maker] += count

    final.append(
        {
            "code": "000",
            "name": "Finland",
            "mileageCount": total_mileage_counts,
            "drivingForceCount": total_driving_force_counts,
            "colorCount": total_color_counts,
            "registrationYearCount": total_year_counts,
            "makerCount": total_maker_counts,
        }
    )

    for municipality in final:
        municipality["mileageCount"] = dict(
            sorted(
                municipality["mileageCount"].items(),
                key=lambda item: _sort_mileage_keys(item[0]),
            )
        )
        municipality["drivingForceCount"] = dict(
            sorted(municipality["drivingForceCount"].items())
        )
        municipality["colorCount"] = dict(sorted(municipality["colorCount"].items()))
        municipality["registrationYearCount"] = dict(
            sorted(municipality["registrationYearCount"].items())
        )
        municipality["makerCount"] = dict(sorted(municipality["makerCount"].items()))

    final.sort(key=lambda x: x["name"])

    return {"date": date, "municipalities": final}


def _sort_mileage_keys(key):
    if key == "na":
        return -1
    if key.startswith("over"):
        return float("inf")
    if key.startswith("under"):
        return 0
    start, end = key.split("kto")
    return int(start) * 1000
