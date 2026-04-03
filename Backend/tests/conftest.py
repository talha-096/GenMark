import pytest
from __init__ import create_app

@pytest.fixture
def app():
    app = create_app('testing')
    app.config.update({
        "TESTING": True,
        "DEBUG": True,
        "MONGO_URI": "mongodb://localhost:27017/test_genmark"
    })
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()
