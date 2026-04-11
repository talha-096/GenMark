import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

def hunt_bucket():
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.getenv('S3_BUCKET_NAME')
    
    regions = [
        'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
        'eu-west-1', 'eu-west-2', 'eu-central-1', 'eu-north-1',
        'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'
    ]

    print(f"Hunting for bucket '{bucket_name}' across common regions...")

    for region in regions:
        s3 = boto3.client(
            's3',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
        try:
            s3.head_bucket(Bucket=bucket_name)
            print(f"FOUND! Bucket '{bucket_name}' exists in region: {region}")
            return
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code')
            if error_code == '403':
                # This often means it exists but you can't access it from this region
                # or it's in a different region and you get a redirect (which head_bucket sometimes handles poorly)
                print(f"[{region}] 403 Forbidden (Could exist here or needs specific region endpoint)")
            elif error_code == '404':
                # 404 is a firm 'no' for this region
                pass
            else:
                print(f"[{region}] Error: {error_code}")

    print("\nHunt finished. Bucket not found in common regions.")

if __name__ == "__main__":
    hunt_bucket()
