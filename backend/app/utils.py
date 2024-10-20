import boto3
from enum import Enum

class FeatureType(Enum):
    TABLES = "TABLES"
    QUERIES = "QUERIES"

def upload_file_to_s3(file, bucket):
    s3_client = boto3.client('s3')
    s3_client.upload_fileobj(
        file.file,
        bucket,
        file.filename,
        ExtraArgs={"ContentType": file.content_type}
    )

def analyze_document(file_name, bucket, feature_type, queries=None, region='us-east-1'):
    textract_client = boto3.client('textract', region_name=region)
    document = {
        'S3Object': {
            'Bucket': bucket,
            'Name': file_name
        }
    }

    analyze_params = {
        'Document': document,
        'FeatureTypes': [feature_type.value]
    }

    if feature_type == FeatureType.QUERIES:
        analyze_params['QueriesConfig'] = {
            'Queries': [{'Text': query} for query in queries]
        }

    response = textract_client.analyze_document(**analyze_params)
    return response