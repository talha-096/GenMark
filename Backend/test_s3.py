import os, sys
sys.path.insert(0, 'd:/GenMark/Backend')
from dotenv import load_dotenv
load_dotenv('d:/GenMark/Backend/.env')

import boto3
from botocore.exceptions import ClientError

key = os.getenv('AWS_ACCESS_KEY_ID')
secret = os.getenv('AWS_SECRET_ACCESS_KEY')
bucket = os.getenv('S3_BUCKET_NAME')
region = os.getenv('AWS_REGION')

print(f'Key: {key[:8]}...' if key else 'Key: NOT SET')
print(f'Bucket: {bucket}')
print(f'Region: {region}')

try:
    client = boto3.client('s3', aws_access_key_id=key, aws_secret_access_key=secret, region_name=region)
    resp = client.head_bucket(Bucket=bucket)
    print('SUCCESS: Bucket is accessible!')

    # Also try a real upload
    test_data = b'hello genmark test'
    client.put_object(Bucket=bucket, Key='test/connectivity_check.txt', Body=test_data)
    print('SUCCESS: Test file uploaded to S3!')

    # Clean up
    client.delete_object(Bucket=bucket, Key='test/connectivity_check.txt')
    print('SUCCESS: Test file cleaned up.')

except ClientError as e:
    code = e.response['Error']['Code']
    msg = e.response['Error']['Message']
    print(f'ClientError [{code}]: {msg}')
except Exception as e:
    print(f'Error [{type(e).__name__}]: {e}')
