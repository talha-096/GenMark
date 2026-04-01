import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base Configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    MONGODB_SETTINGS = {
        'host': os.getenv('MONGO_URI', 'mongodb://localhost:27017/GenMarkDB')
    }
    JWT_SECRET_KEY = os.getenv('SECRET_KEY')  # Use same key for simplicity in dev
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
    # In prod, we would enforce stronger secrets here or via env vars

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
