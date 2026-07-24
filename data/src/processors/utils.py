from datetime import datetime


def get_date() -> str:
    return datetime.now(tz=datetime.UTC).strftime("%Y-%m-%d")
