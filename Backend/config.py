import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base Configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/GenMarkDB?serverSelectionTimeoutMS=5000')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', os.getenv('SECRET_KEY', 'default-secret-key'))
    SCHEDULER_API_ENABLED = True
    
    # Swagger Config
    SWAGGER = {
        'title': 'GenMark API',
        'uiversion': 3
    }

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    MONGO_URI = os.getenv('MONGO_URI_TEST', 'mongodb://localhost:27017/genmark_test')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
