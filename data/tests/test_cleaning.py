import unittest
import pandas as pd
from data.src.data_cleaning import clean


class TestCleaning(unittest.TestCase):
    def setUp(self):
        self.vehicles = pd.DataFrame(
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
                "odometer": [5000, 10000, None, 12000, 1500, 80000],
            }
        )

        self.municipalities = {
            "001": "City A",
            "002": "City B",
        }

    def test_clean_valid_data(self):
        vehicles, municipalities = clean(self.vehicles, self.municipalities)

        self.assertEqual(2022, vehicles["registration_year"][0])
        self.assertEqual("001", vehicles["municipality"][0])
        self.assertEqual("black", vehicles["color"][0])
        self.assertEqual("3", vehicles["driving_force"][0])
        self.assertEqual("Toyota", vehicles["maker"][0])
        self.assertEqual(5000, vehicles["odometer"][0])

        self.assertEqual(2019, vehicles["registration_year"][1])
        self.assertEqual("002", vehicles["municipality"][1])
        self.assertEqual("brown", vehicles["color"][1])
        self.assertEqual("2", vehicles["driving_force"][1])
        self.assertEqual("Ford", vehicles["maker"][1])
        self.assertEqual(10000, vehicles["odometer"][1])

        self.assertEqual(2021, vehicles["registration_year"][2])
        self.assertEqual("001", vehicles["municipality"][2])
        self.assertEqual("red", vehicles["color"][2])
        self.assertEqual("3", vehicles["driving_force"][2])
        self.assertEqual("Volkswagen", vehicles["maker"][2])
        self.assertEqual(0, vehicles["odometer"][2])

        self.assertEqual(2018, vehicles["registration_year"][3])
        self.assertEqual("002", vehicles["municipality"][3])
        self.assertEqual("green", vehicles["color"][3])
        self.assertEqual("4", vehicles["driving_force"][3])
        self.assertEqual("Volkswagen", vehicles["maker"][3])
        self.assertEqual(12000, vehicles["odometer"][3])

        self.assertEqual(2020, vehicles["registration_year"][4])
        self.assertEqual("999", vehicles["municipality"][4])
        self.assertEqual("white", vehicles["color"][4])
        self.assertEqual("5", vehicles["driving_force"][4])
        self.assertEqual("Other", vehicles["maker"][4])
        self.assertEqual(1500, vehicles["odometer"][4])

        self.assertEqual(1979, vehicles["registration_year"][5])
        self.assertEqual("999", vehicles["municipality"][5])
        self.assertEqual("silver", vehicles["color"][5])
        self.assertEqual("5", vehicles["driving_force"][5])
        self.assertEqual("Other", vehicles["maker"][5])
        self.assertEqual(80000, vehicles["odometer"][5])

        self.assertEqual(3, len(municipalities.keys()))
        self.assertIn("001", municipalities)
        self.assertIn("002", municipalities)
        self.assertIn("999", municipalities)


if __name__ == "__main__":
    unittest.main()
