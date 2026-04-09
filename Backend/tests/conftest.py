import pytest
import sys
import os

# Add Backend to sys.path so we can import modules correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from __init__ import create_app

@pytest.fixture
def app():
    app = create_app('testing')
    app.config.update({
        "TESTING": True,
        "MONGO_URI": "mongodb://localhost:27017/genmark_test"
    })
    yield app

@pytest.fixture
def client(app):
    return app.test_client()
