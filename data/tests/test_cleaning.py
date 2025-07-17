import pandas as pd
import pytest
from src.data_cleaning import clean


@pytest.fixture
def vehicles():
    return pd.DataFrame(
        {
            "registration_date": [
                "2022-01-01",
                "2019-06-15",
                "2021-03-12",
                "2018-09-30",
                "invalid_date",
                None,
            ],
            "intro_date": [
                "20200101",
                "20180615",
                "20190301",
                "20170825",
                "20201205",
                None,
            ],
            "municipality": ["001", "002", "001", "002", "abc", None],
            "is_hybrid": ["true", "false", "True", "False", "abc", None],
            "color": ["0", "1", "2", "5", "9", "Y"],
            "driving_force": ["01", "02", "03", "04", "05", "99"],
            "maker_text": ["Toyota", "Ford", "volkswagen", "vw", "ferraari", None],
            "mileage": [5000, 10000, None, 12000, 1500, 80000],
        }
    )


@pytest.fixture
def municipalities():
    return {
        "001": "City A",
        "002": "City B",
    }


def test_clean_valid_data(vehicles, municipalities):
    cleaned = clean(vehicles, municipalities)

    assert cleaned["registration_year"][0] == 2022
    assert cleaned["municipality"][0] == "001"
    assert cleaned["color"][0] == "black"
    assert cleaned["driving_force"][0] == "hybrid"
    assert cleaned["maker"][0] == "Toyota"
    assert cleaned["mileage"][0] == 5000

    assert cleaned["registration_year"][1] == 2019
    assert cleaned["municipality"][1] == "002"
    assert cleaned["color"][1] == "brown"
    assert cleaned["driving_force"][1] == "diesel"
    assert cleaned["maker"][1] == "Ford"
    assert cleaned["mileage"][1] == 10000

    assert cleaned["registration_year"][2] == 2021
    assert cleaned["municipality"][2] == "001"
    assert cleaned["color"][2] == "red"
    assert cleaned["driving_force"][2] == "hybrid"
    assert cleaned["maker"][2] == "Volkswagen"
    assert cleaned["mileage"][2] == -1

    assert cleaned["registration_year"][3] == 2018
    assert cleaned["municipality"][3] == "002"
    assert cleaned["color"][3] == "green"
    assert cleaned["driving_force"][3] == "electricity"
    assert cleaned["maker"][3] == "Volkswagen"
    assert cleaned["mileage"][3] == 12000

    assert cleaned["registration_year"][4] == 2020
    assert cleaned["municipality"][4] == "999"
    assert cleaned["color"][4] == "white"
    assert cleaned["driving_force"][4] == "other"
    assert cleaned["maker"][4] == "Other"
    assert cleaned["mileage"][4] == 1500

    assert cleaned["registration_year"][5] == 1979
    assert cleaned["municipality"][5] == "999"
    assert cleaned["color"][5] == "silver"
    assert cleaned["driving_force"][5] == "other"
    assert cleaned["maker"][5] == "Other"
    assert cleaned["mileage"][5] == 80000
