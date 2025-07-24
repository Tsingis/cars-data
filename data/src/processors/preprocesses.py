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
        pd.to_numeric(vehicles["intro_date"].str[:4], errors="coerce").fillna(0).astype("Int16")
    )
    vehicles["registration_year"] = (
        vehicles["registration_date"].dt.year.fillna(vehicles["intro_year"]).astype("Int16")
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

    vehicles["driving_force"] = vehicles["driving_force"].map(driving_force_map).fillna("other")
    vehicles["driving_force"] = np.where(vehicles["is_hybrid"], "hybrid", vehicles["driving_force"])

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
