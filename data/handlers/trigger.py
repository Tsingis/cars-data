from typing import Tuple
import botocore.session
import io
import json
import logging
import os
import requests
import zipfile

BUCKET = os.getenv("BUCKET")
REGION = os.getenv("AWS_REGION")
DATA_LAMBDA = os.getenv("DATA_LAMBDA")
VEHICLES_URL = os.getenv("VEHICLES_URL")

METADATA = "metadata.json"

logger = logging.getLogger(__name__)
logFormat = "%(asctime)s %(levelname)s: %(message)s"
logging.basicConfig(level=logging.INFO, format=logFormat, force=True)

# Suppress some of boto logging
logging.getLogger("botocore").setLevel(logging.WARNING)

session = botocore.session.get_session()


def handler(event: dict, context: dict):
    try:
        logger.info("Checking for new data")
        csv_name, csv_size = get_raw_data_file_metadata()
        meta_name, meta_size = get_stored_metadata(METADATA)
        if meta_name is None and meta_size is None:
            logger.info("Metadata did not exist. Creating new...")
            set_stored_metadata(csv_name, csv_size, METADATA)
        if (csv_name, csv_size) != (meta_name, meta_size):
            logger.info("Generate new data")
            set_stored_metadata(csv_name, csv_size, METADATA)
            lambda_client = session.create_client("lambda", region_name=REGION)
            lambda_client.invoke(FunctionName=DATA_LAMBDA, InvocationType="Event")
        else:
            logger.info("No new data")
    except Exception:
        logger.exception("Error processing trigger")


def get_raw_data_file_metadata() -> Tuple[str, int]:
    response = requests.get(VEHICLES_URL)
    response.raise_for_status()
    zip_bytes = io.BytesIO(response.content)
    with zipfile.ZipFile(zip_bytes) as z:
        csv_info = next((info for info in z.infolist() if info.filename.endswith(".csv")), None)
        if not csv_info:
            raise FileNotFoundError("No CSV found in ZIP")
        return csv_info.filename, csv_info.file_size


def get_stored_metadata(key: str) -> Tuple[str, int]:
    s3_client = session.create_client("s3", region_name=REGION)
    try:
        obj = s3_client.get_object(Bucket=BUCKET, Key=key)
        content = obj["Body"].read().decode("utf-8")
        metadata = json.loads(content)
        return metadata.get("filename"), metadata.get("filesize")
    except s3_client.exceptions.NoSuchKey:
        logger.warning(f"Object {key} not found")
        return None, None
    except Exception:
        logger.exception(f"Error getting object {key}")


def set_stored_metadata(filename: str, filesize: int, key: str) -> Tuple[str, int]:
    try:
        s3_client = session.create_client("s3", region_name=REGION)
        metadata = {"filename": filename, "filesize": filesize}
        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=json.dumps(metadata, indent=0, ensure_ascii=False),
        )
        tags = [{"Key": "AllowExpiration", "Value": "false"}]
        s3_client.put_object_tagging(Bucket=BUCKET, Key=key, Tagging={"TagSet": tags})
        return filename, filesize
    except Exception:
        logger.exception(f"Error updating object {key}")
