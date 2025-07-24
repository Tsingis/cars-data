import pandas as pd
import pytest
from src.processors.postprocesses import generate


@pytest.fixture
def date():
    return "2024-08-21"


@pytest.fixture
def municipalities():
    return {"001": "Helsinki", "002": "Espoo"}


@pytest.fixture
def df():
    return pd.DataFrame(
        {
            "driving_force": [
                "electricity",
                "petrol",
                "electricity",
                "petrol",
                "electricity",
            ],
            "color": ["red", "blue", "red", "blue", "green"],
            "maker": ["Tesla", "BMW", "Tesla", "BMW", "Tesla"],
            "registration_year": [2020, 2021, 2020, 2022, 2020],
            "mileage": [-1, 45000, 125000, 245000, 615000],
            "municipality": ["001", "002", "001", "002", "001"],
        }
    )


def test_generate_function(df, municipalities, date):
    expected_municipalities = [
        {
            "code": "000",
            "name": "Finland",
            "mileageCount": {
                "na": 1,
                "under50k": 1,
                "100kto150k": 1,
                "200kto250k": 1,
                "over600k": 1,
            },
            "drivingForceCount": {"petrol": 2, "electricity": 3},
            "colorCount": {"blue": 2, "green": 1, "red": 2},
            "registrationYearCount": {"2020": 3, "2021": 1, "2022": 1},
            "makerCount": {"BMW": 2, "Tesla": 3},
        },
        {
            "code": "001",
            "name": "Helsinki",
            "mileageCount": {"na": 1, "100kto150k": 1, "over600k": 1},
            "drivingForceCount": {"petrol": 0, "electricity": 3},
            "colorCount": {"blue": 0, "green": 1, "red": 2},
            "registrationYearCount": {"2020": 3},
            "makerCount": {"Tesla": 3},
        },
        {
            "code": "002",
            "name": "Espoo",
            "mileageCount": {"under50k": 1, "200kto250k": 1},
            "drivingForceCount": {"petrol": 2, "electricity": 0},
            "colorCount": {"blue": 2, "green": 0, "red": 0},
            "registrationYearCount": {"2021": 1, "2022": 1},
            "makerCount": {"BMW": 2},
        },
    ]

    result = generate(df, municipalities, date)

    assert result["date"] == "2024-08-21"
    assert len(result["municipalities"]) == 3
    assert result["municipalities"][1] == expected_municipalities[0]
    assert result["municipalities"][2] == expected_municipalities[1]
    assert result["municipalities"][0] == expected_municipalities[2]
