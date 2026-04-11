import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

def probe_bucket():
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.getenv('S3_BUCKET_NAME')
    
    # Try with a default region first
    s3 = boto3.client(
        's3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    
    try:
        print(f"Probing bucket: {bucket_name}")
        location = s3.get_bucket_location(Bucket=bucket_name)
        region = location['LocationConstraint'] or 'us-east-1'
        print(f"Found bucket! Region: {region}")
    except ClientError as e:
        print(f"Error probing bucket: {e}")

if __name__ == "__main__":
    probe_bucket()
