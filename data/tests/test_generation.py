import unittest
import pandas as pd
from data.src.data_cleaning import generate


class TestGenerateFunction(unittest.TestCase):

    def setUp(self):
        self.date = "2024-08-21"
        self.municipalities = {"001": "Helsinki", "002": "Espoo"}
        self.df = pd.DataFrame(
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
                "mileage": [20_000, 45_000, 125_000, 245_000, 615_000],
                "municipality": ["001", "002", "001", "002", "001"],
            }
        )

    def test_generate_function(self):
        municipalities = [
            {
                "code": "000",
                "name": "Finland",
                "mileageCount": {"50000": 2, "150000": 1, "250000": 1, "600001": 1},
                "drivingForceCount": {"petrol": 2, "electricity": 3},
                "colorCount": {"blue": 2, "green": 1, "red": 2},
                "registrationYearCount": {"2020": 3, "2021": 1, "2022": 1},
                "makerCount": {"BMW": 2, "Tesla": 3},
            },
            {
                "code": "001",
                "name": "Helsinki",
                "mileageCount": {"50000": 1, "150000": 1, "600001": 1},
                "drivingForceCount": {"petrol": 0, "electricity": 3},
                "colorCount": {"blue": 0, "green": 1, "red": 2},
                "registrationYearCount": {"2020": 3},
                "makerCount": {"Tesla": 3},
            },
            {
                "code": "002",
                "name": "Espoo",
                "mileageCount": {"50000": 1, "250000": 1},
                "drivingForceCount": {"petrol": 2, "electricity": 0},
                "colorCount": {"blue": 2, "green": 0, "red": 0},
                "registrationYearCount": {"2021": 1, "2022": 1},
                "makerCount": {"BMW": 2},
            },
        ]

        result = generate(self.df, self.municipalities, self.date)

        self.assertEqual("2024-08-21", result["date"])
        self.assertEqual(3, len(result["municipalities"]))
        self.assertEqual(municipalities[0], result["municipalities"][1])
        self.assertEqual(municipalities[1], result["municipalities"][2])
        self.assertEqual(municipalities[2], result["municipalities"][0])


if __name__ == "__main__":
    unittest.main()
