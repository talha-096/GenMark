import boto3
import logging
import os
from botocore.exceptions import ClientError

class S3Service:
    """Service to handle interactions with AWS S3."""

    def __init__(self):
        try:
            from flask import current_app
            self.access_key = current_app.config.get('AWS_ACCESS_KEY_ID')
            self.secret_key = current_app.config.get('AWS_SECRET_ACCESS_KEY')
            self.bucket_name = current_app.config.get('AWS_S3_BUCKET')
            self.region = current_app.config.get('AWS_REGION')
        except (RuntimeError, ImportError):
            self.access_key = os.getenv('AWS_ACCESS_KEY_ID')
            self.secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
            self.bucket_name = os.getenv('S3_BUCKET_NAME')
            self.region = os.getenv('AWS_REGION', 'us-east-1')

        # Robustness check: if current_app exists but config is missing, fallback to env
        if not self.access_key: self.access_key = os.getenv('AWS_ACCESS_KEY_ID')
        if not self.secret_key: self.secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        if not self.bucket_name: self.bucket_name = os.getenv('S3_BUCKET_NAME')
        if not self.region: self.region = os.getenv('AWS_REGION', 'us-east-1')
        
        # Initialize the S3 client
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name=self.region
        )

    def upload_file(self, file_data, object_name, content_type=None):
        """
        Uploads a file to an S3 bucket.
        
        :param file_data: File object or bytes to upload.
        :param object_name: S3 object name (key).
        :param content_type: Optional MIME type.
        :return: True if successful, None otherwise.
        """
        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type

            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=object_name,
                Body=file_data,
                **extra_args
            )
            return True
        except ClientError as e:
            logging.error(f"S3 Upload Error: {e}")
            return False

    def get_presigned_url(self, object_name, expiration=3600):
        """
        Generates a presigned URL to share an S3 object.
        
        :param object_name: S3 object name (key).
        :param expiration: Time in seconds for the presigned URL to remain valid.
        :return: Presigned URL as string. If error, returns None.
        """
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logging.error(f"S3 URL Generation Error: {e}")
            return None

    def delete_file(self, object_name):
        """
        Deletes an object from an S3 bucket.
        
        :param object_name: S3 object name (key).
        :return: True if successful, False otherwise.
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_name)
            return True
        except ClientError as e:
            logging.error(f"S3 Deletion Error: {e}")
            return False

    def list_files(self, prefix=""):
        """
        Lists objects in an S3 bucket with a specific prefix.
        
        :param prefix: Optional prefix to filter results.
        :return: List of object names (keys).
        """
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix)
            if 'Contents' in response:
                return [obj['Key'] for obj in response['Contents']]
            return []
        except ClientError as e:
            logging.error(f"S3 Listing Error: {e}")
            return []
