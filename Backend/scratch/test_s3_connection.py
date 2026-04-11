import os
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def test_s3_connection():
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.getenv('S3_BUCKET_NAME')
    region = os.getenv('AWS_REGION', 'us-east-1')

    print(f"--- S3 Connection Test ---")
    print(f"Bucket: {bucket_name}")
    print(f"Region: {region}")
    print(f"Access Key: {access_key}")
    
    if not all([access_key, secret_key, bucket_name]):
        print("ERROR: Missing AWS credentials in .env file.")
        return

    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )

        # 1. Test Bucket Access
        print(f"\n[1/3] Checking access to bucket '{bucket_name}'...")
        s3.head_bucket(Bucket=bucket_name)
        print(f"SUCCESS: Bucket '{bucket_name}' is accessible.")

        # 2. Test Small Upload/Delete
        test_filename = "test_connection_marker.txt"
        print(f"\n[2/3] Performing test upload/delete operations...")
        s3.put_object(Bucket=bucket_name, Key=test_filename, Body="S3 Connection Test Successful")
        print(f"SUCCESS: Uploaded '{test_filename}'.")
        
        s3.delete_object(Bucket=bucket_name, Key=test_filename)
        print(f"SUCCESS: Deleted '{test_filename}'.")

        # 3. Test Listing Buckets (Optional, might fail if restricted)
        try:
            print("\n[3/3] Verifying credentials by listing all buckets (optional)...")
            s3.list_buckets()
            print("SUCCESS: Full account access verified.")
        except ClientError:
            print("INFO: ListAllMyBuckets denied (expected for restricted users).")

        print("\n--- ALL TESTS PASSED ---")

    except NoCredentialsError:
        print("ERROR: AWS credentials not found.")
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == '403':
            print("ERROR: 403 Forbidden. Check your IAM permissions.")
        elif error_code == '404':
            print(f"ERROR: Bucket '{bucket_name}' not found.")
        else:
            print(f"S3 CLIENT ERROR: {e}")
    except Exception as e:
        print(f"UNEXPECTED ERROR: {e}")

if __name__ == "__main__":
    test_s3_connection()
