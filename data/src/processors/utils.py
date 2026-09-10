from datetime import UTC, datetime


def get_date() -> str:
    return datetime.now(tz=UTC).strftime("%Y-%m-%d")


def get_data() -> str:
    return get_date()
