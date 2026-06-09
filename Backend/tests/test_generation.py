import io
import json
import time
from unittest.mock import patch

def test_upload_image_and_generate_image_to_text(client):
    # 1. Register a test user to get JWT token
    unique_email = f"test_generation_{int(time.time())}@example.com"
    reg_response = client.post('/api/auth/register', json={
        "name": "Test User",
        "email": unique_email,
        "password": "testpassword123"
    })
    assert reg_response.status_code == 201
    reg_data = json.loads(reg_response.data)
    token = reg_data['token']
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # 2. Test uploading an image
    # Mock S3Service upload and URL generation
    with patch('services.s3_service.S3Service.upload_file') as mock_upload, \
         patch('services.s3_service.S3Service.get_presigned_url') as mock_url:
        
        mock_upload.return_value = True
        mock_url.return_value = "https://mock-s3-bucket.s3.amazonaws.com/uploads/test.png"

        # Create a mock image file
        data = {
            'image': (io.BytesIO(b"abcdef"), 'test.png')
        }
        
        response = client.post(
            '/api/generate/upload-image',
            data=data,
            content_type='multipart/form-data',
            headers=headers
        )
        assert response.status_code == 200
        res_data = json.loads(response.data)
        assert res_data['image_url'] == "https://mock-s3-bucket.s3.amazonaws.com/uploads/test.png"
        assert 's3_path' in res_data

    # 3. Test image to text endpoint
    with patch('services.llm_service.LLMService.generate_image_to_text') as mock_gen:
        mock_gen.return_value = {
            "content": "A high-fidelity modern workspace logo",
            "model": "florence-2-large-hf",
            "type": "text",
            "brand_applied": False
        }

        response = client.post(
            '/api/generate/image-to-text',
            json={
                "image_url": "https://mock-s3-bucket.s3.amazonaws.com/uploads/test.png",
                "prompt": "<DETAILED_CAPTION>"
            },
            headers=headers
        )
        assert response.status_code == 200
        res_data = json.loads(response.data)
        assert res_data['content'] == "A high-fidelity modern workspace logo"
        assert res_data['model'] == "florence-2-large-hf"
