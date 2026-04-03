import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-key")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/genmark_db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-me")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    SCHEDULER_API_ENABLED = True
    SWAGGER = {
        "title": "GenMark API",
        "uiversion": 3
    }

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = "mongodb://localhost:27017/test_genmark"

config = {
    'default': Config,
    'development': Config,
    'testing': TestingConfig
}
