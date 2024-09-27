import boto3
import json
import logging
import os
import time
from pydantic import ValidationError
from .data_import import get_municipalities, get_vehicles, get_date
from .data_cleaning import clean, generate
from .data_validation import validate

BUCKET = os.getenv("BUCKET")
DISTRIBUTION = os.getenv("DISTRIBUTION")
FILENAME = os.getenv("FILENAME", "data.json")

logger = logging.getLogger()
if logger.handlers:
    for handler in logger.handlers:
        logger.removeHandler(handler)

logFormat = "%(asctime)s %(name)s %(levelname)s: %(message)s"
logging.basicConfig(level=logging.WARNING, format=logFormat)


def handler(event: dict, context: dict):
    try:
        municipalities = get_municipalities()
        vehicles = get_vehicles()
        (vehicles, municipalities) = clean(vehicles, municipalities)
        data = generate(vehicles, municipalities, date=get_date())
        valid = validate(data, municipalities)
        if valid:
            logger.info("Creating new data")
            s3 = boto3.client("s3")
            s3.put_object(
                Bucket=BUCKET,
                Key=FILENAME,
                Body=json.dumps(data, indent=0, ensure_ascii=False),
            )
            tags = [{"Key": "AllowExpiration", "Value": "false"}]
            s3.put_object_tagging(Bucket=BUCKET, Key=FILENAME, Tagging={"TagSet": tags})
            invalidate(FILENAME)
    except ValidationError:
        logger.exception("Invalid data")
    except Exception:
        logger.exception("Error processing data")


def invalidate(file: str):
    try:
        logger.info("Invalidating data")
        cf = boto3.client("cloudfront")
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
        logger.exception("Error invalidating data")
