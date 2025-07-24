from typing import Tuple
import botocore.session
import json
import logging
import os
import time
from pydantic import ValidationError
from processors.preprocesses import clean
from processors.postprocesses import generate
from processors.imports import get_municipalities, get_vehicles
from processors.utils import get_date
from processors.validations import validate

BUCKET = os.getenv("BUCKET")
DISTRIBUTION = os.getenv("DISTRIBUTION")
FILENAME = os.getenv("FILENAME", "data.json")
REGION = os.getenv("AWS_REGION")

logger = logging.getLogger(__name__)
logFormat = "%(asctime)s %(levelname)s: %(message)s"
logging.basicConfig(level=logging.INFO, format=logFormat, force=True)

# Suppress some of boto logging
logging.getLogger("botocore").setLevel(logging.WARNING)

session = botocore.session.get_session()


def handler(event: dict, context: dict):
    try:
        (valid, data) = generate_data()
        if valid:
            logger.info("Creating new data")
            s3 = session.create_client("s3", region_name=REGION)
            s3.put_object(
                Bucket=BUCKET,
                Key=FILENAME,
                Body=json.dumps(data, indent=0, ensure_ascii=False),
            )
            tags = [{"Key": "AllowExpiration", "Value": "false"}]
            s3.put_object_tagging(Bucket=BUCKET, Key=FILENAME, Tagging={"TagSet": tags})
            invalidate_cache(FILENAME)
    except ValidationError:
        logger.exception("Invalid data")
    except Exception:
        logger.exception("Error processing data")


def generate_data() -> Tuple[bool, dict]:
    municipalities = get_municipalities()
    vehicles = get_vehicles()
    vehicles = clean(vehicles, municipalities)
    data = generate(vehicles, municipalities, date=get_date())
    valid = validate(data, municipalities)
    return valid, data


def invalidate_cache(file: str):
    try:
        logger.info("Invalidating distribution cache")
        cf = session.create_client("cloudfront", region_name=REGION)
        paths = [f"/{file}"]
        cf.create_invalidation(
            DistributionId=DISTRIBUTION,
            InvalidationBatch={
                "Paths": {
                    "Quantity": len(paths),
                    "Items": paths,
                },
                "CallerReference": str(time.time()),
            },
        )
    except Exception:
        logger.exception("Error invalidating distribution cache")


if __name__ == "__main__":
    (valid, data) = generate_data()
    logger.info("Data is valid")
