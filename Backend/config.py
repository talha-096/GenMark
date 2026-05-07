import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base Configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/GenMarkDB?serverSelectionTimeoutMS=5000')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', os.getenv('SECRET_KEY', 'default-secret-key'))
    SCHEDULER_API_ENABLED = True
    
    # AWS S3 Configuration
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_S3_BUCKET = os.getenv('S3_BUCKET_NAME')
    AWS_S3_REGION = os.getenv('AWS_REGION', 'us-east-1')
    
    # Local LLM Configuration
    LOCAL_LLM_MODEL_PATH = os.getenv('LOCAL_LLM_MODEL_PATH', r'D:\GenMark\Model')
    LOCAL_LLM_THREADS = int(os.getenv('LOCAL_LLM_THREADS', 4))
    LOCAL_LLM_CTX = int(os.getenv('LOCAL_LLM_CTX', 2048))
    USE_TRANSFORMERS = True
    # User requested full memory, so we disable quantization
    QUANTIZE_MODEL = False
    
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
