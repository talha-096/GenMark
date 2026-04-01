import pytest
from flask import json

def test_health_check(client):
    """Test the basic health check endpoint."""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'version' in data

def test_api_docs_access(client):
    """Test that Swagger UI is accessible."""
    response = client.get('/apidocs/')
    assert response.status_code == 200

def test_config_loading(app):
    """Test that the app configuration is loaded correctly."""
    assert app.config['DEBUG'] is True
    assert 'MONGO_URI' in app.config
