import io
import os
import pandas as pd
import requests
import zipfile

VEHICLES_URL = os.getenv("VEHICLES_URL")
MUNICIPALITIES_URL = os.getenv("MUNICIPALITIES_URL")


def get_vehicles() -> pd.DataFrame:
    response = requests.get(VEHICLES_URL)
    response.raise_for_status()
    zip_bytes = io.BytesIO(response.content)
    with zipfile.ZipFile(zip_bytes) as z:
        csv_file = next((f for f in z.namelist() if f.endswith(".csv")), None)

        if not csv_file:
            raise FileNotFoundError("No CSV file found")

        with z.open(csv_file) as f:
            csv_content = f.read()

    csv_string_io = io.StringIO(csv_content.decode("latin1"))
    column_map = {
        "ensirekisterointipvm": "registration_date",
        "kayttoonottopvm": "intro_date",
        "ajoneuvoluokka": "classification",
        "vari": "color",
        "kayttovoima": "driving_force",
        "sahkohybridi": "is_hybrid",
        "merkkiSelvakielinen": "maker_text",
        "kunta": "municipality",
        "matkamittarilukema": "mileage",
    }

    df = pd.read_csv(
        csv_string_io,
        sep=";",
        quotechar="'",
        encoding="latin",
        low_memory=False,
        memory_map=False,
        usecols=column_map.keys(),
        dtype={
            "vari": str,
            "kayttovoima": str,
            "kunta": str,
            "sahkohybridi": str,
            "merkkiSelvakielinen": str,
        },
    )

    df.rename(mapper=column_map, axis=1, inplace=True)

    # Filter to only passenger vehicle classes
    df = df[df["classification"].isin(["M1", "M1G"])]
    df.drop(labels="classification", axis=1, inplace=True)

    df.reset_index(inplace=True, drop=True)
    return df


def get_municipalities() -> dict:
    response = requests.get(MUNICIPALITIES_URL)
    response.raise_for_status()
    municipalities = {
        item["code"]: item["classificationItemNames"][0]["name"] for item in response.json()
    }
    municipalities["999"] = "Unknown"  # Add unknown
    return municipalities
