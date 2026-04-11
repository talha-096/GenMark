import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

def attempt_create_bucket():
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.getenv('S3_BUCKET_NAME')
    region = os.getenv('AWS_REGION', 'eu-north-1')

    print(f"Attempting to create/verify bucket: {bucket_name}")
    print(f"Target Region: {region}")

    s3 = boto3.client(
        's3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region
    )

    try:
        if region == 'us-east-1':
            s3.create_bucket(Bucket=bucket_name)
        else:
            s3.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={'LocationConstraint': region}
            )
        print(f"SUCCESS: Bucket '{bucket_name}' created successfully in {region}.")
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == 'BucketAlreadyOwnedByYou':
            print(f"INFO: You already own this bucket. It exists.")
        elif error_code == 'BucketAlreadyExists':
            print(f"ERROR: The bucket name '{bucket_name}' is already taken globally. You must choose a different name.")
        elif error_code == 'AccessDenied':
            print(f"ERROR: Access Denied. Your IAM user does not have 's3:CreateBucket' permissions.")
        else:
            print(f"S3 ERROR: {e}")

if __name__ == "__main__":
    attempt_create_bucket()
