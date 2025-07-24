import pandas as pd


def generate(df: pd.DataFrame, municipalities: dict, date: str) -> dict:
    # Groupings
    bin_size = 50_000
    bins = [-1, 0] + list(range(bin_size, 600_001, bin_size)) + [df["mileage"].max() + 1]
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
        df.groupby(["color", "municipality"], observed=True).size().reset_index(name="count")
    )
    grouped_maker = (
        df.groupby(["maker", "municipality"], observed=True).size().reset_index(name="count")
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
        mileage_group = grouped_mileage[grouped_mileage["municipality"] == municipality_code]
        mileage_counts = dict(zip(mileage_group["mileage_group"], mileage_group["count"]))

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
    total_driving_force_counts = dict.fromkeys(driving_forces, 0)
    total_color_counts = dict.fromkeys(colors, 0)
    total_year_counts = {str(year): 0 for year in years}
    total_maker_counts = dict.fromkeys(makers, 0)

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
        municipality["drivingForceCount"] = dict(sorted(municipality["drivingForceCount"].items()))
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
    start = key.split("kto")[0]
    return int(start) * 1000
