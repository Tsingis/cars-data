import re
from pydantic import BaseModel, field_validator, model_validator


class Municipality(BaseModel):
    code: str
    name: str
    mileageCount: dict[str, int]
    drivingForceCount: dict[str, int]
    colorCount: dict[str, int]
    registrationYearCount: dict[str, int]
    makerCount: dict[str, int]

    @field_validator("drivingForceCount", mode="before")
    def check_keys_in_drivingForceCount(cls, value):
        required_keys = {"petrol", "diesel", "hybrid", "electricity", "other"}
        if not required_keys.issubset(value.keys()):
            missing_keys = required_keys - set(value.keys())
            raise ValueError(f"Missing keys in 'drivingForceCount': {missing_keys}")
        return value

    @field_validator("colorCount", mode="before")
    def check_keys_in_colorCount(cls, value):
        required_keys = {
            "black",
            "blue",
            "brown",
            "green",
            "grey",
            "red",
            "silver",
            "white",
            "other",
        }
        if not required_keys.issubset(value.keys()):
            missing_keys = required_keys - set(value.keys())
            raise ValueError(f"Missing keys in 'colorCount': {missing_keys}")
        return value

    @field_validator("registrationYearCount", mode="before")
    def check_keys_are_years(cls, value):
        if not all(key.isdigit() and len(key) == 4 for key in value.keys()):
            raise ValueError("All keys in 'registrationYearCount' must be four-digit years")
        return value

    @model_validator(mode="before")
    def check_keys_are_strings(cls, values):
        for field in ["makerCount", "mileageCount"]:
            if not all(isinstance(key, str) for key in values[field].keys()):
                raise ValueError(f"All keys in '{field}' must be strings")
        return values

    @model_validator(mode="before")
    def sanity_check(cls, values):
        def check_counts(count_dict):
            return sum(count_dict.values())

        mileage_count_sum = check_counts(values["mileageCount"])
        driving_force_count_sum = check_counts(values["drivingForceCount"])
        color_count_sum = check_counts(values["colorCount"])
        registration_year_count_sum = check_counts(values["registrationYearCount"])
        maker_count_sum = check_counts(values["makerCount"])

        if not (
            mileage_count_sum
            == driving_force_count_sum
            == color_count_sum
            == registration_year_count_sum
            == maker_count_sum
        ):
            raise ValueError(f"Total counts do not match for {values.get('name')}: ")
        return values


class DataModel(BaseModel):
    date: str
    municipalities: list[Municipality]

    @field_validator("date")
    def validate_date_format(cls, value):
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            raise ValueError("The 'date' field must be in 'YYYY-MM-DD' format")
        return value

    @model_validator(mode="before")
    def check_municipalities_length(cls, values):
        expected_max_length = getattr(cls, "expected_max_length")
        expected = len(values["municipalities"]) - 1  # Minus total
        if expected > expected_max_length:
            raise ValueError(
                f"'municipalities' list must contain at most {expected_max_length} items. Has {expected}"
            )
        return values

    @classmethod
    def create_with_expected_max_length(cls, data: dict, expected_max_length: int):
        cls.expected_max_length = expected_max_length
        return cls(**data)


def validate(data: dict, municipalities: dict) -> bool:
    expected_max_length = len(municipalities.keys())
    DataModel.create_with_expected_max_length(data, expected_max_length)
    return True
