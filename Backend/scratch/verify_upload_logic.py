import os
import sys
# Add parent directory to path so we can import services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.s3_service import S3Service
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def mock_upload_logic():
    print("--- Mocking Logo Upload Logic ---")
    
    # Mock file data
    filename = "My Super Logo! @2026.png"
    content_type = "image/png"
    dummy_data = b"fake-image-data"

    # Step 1: Clean filename & create path (copied from brand_routes.py)
    timestamp = int(datetime.utcnow().timestamp())
    clean_name = "".join(c for c in filename if c.isalnum() or c in "._-").strip()
    s3_path = f"logos/logo_{timestamp}_{clean_name}"
    
    print(f"Original: {filename}")
    print(f"Cleaned Path: {s3_path}")

    # Step 2: Upload to S3
    s3 = S3Service()
    success = s3.upload_file(dummy_data, s3_path, content_type=content_type)
    
    if success:
        url = s3.get_presigned_url(s3_path)
        print(f"SUCCESS: Uploaded to S3.")
        print(f"URL: {url}")
        
        # Cleanup
        s3.client.delete_object(Bucket=os.getenv('S3_BUCKET_NAME'), Key=s3_path)
        print("Cleanup: Deleted test object.")
    else:
        print("FAILED: S3 upload failed.")

if __name__ == "__main__":
    mock_upload_logic()
