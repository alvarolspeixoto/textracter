import boto3
from enum import Enum
import os

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
ENVIRONMENT = os.getenv("ENVIRONMENT")


class FeatureType(Enum):
    TABLES = "TABLES"
    QUERIES = "QUERIES"


def upload_file_to_s3(file, bucket):
    if ENVIRONMENT == 'production':
        s3_client = boto3.client("s3")
    else:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            aws_session_token=AWS_SESSION_TOKEN,
        )
    s3_client.upload_fileobj(
        file.file, bucket, file.filename, ExtraArgs={"ContentType": file.content_type}
    )


def analyze_document(file_name, bucket, feature_type, queries=None, region="us-east-1"):
    if ENVIRONMENT == 'production':
        textract_client = boto3.client("textract", region_name=region)
    else:
        textract_client = boto3.client(
            "textract",
            region_name=region,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            aws_session_token=AWS_SESSION_TOKEN,
        )
    document = {"S3Object": {"Bucket": bucket, "Name": file_name}}

    analyze_params = {"Document": document, "FeatureTypes": [feature_type.value]}

    if feature_type == FeatureType.QUERIES:
        analyze_params["QueriesConfig"] = {
            "Queries": [{"Text": query} for query in queries]
        }

    response = textract_client.analyze_document(**analyze_params)
    return response
