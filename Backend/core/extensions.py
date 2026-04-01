from pymongo import MongoClient
from core.config import Config
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flasgger import Swagger

# Database
client = MongoClient(Config.MONGO_URI)
db = client.get_database()

# Extensions
jwt = JWTManager()
cors = CORS()
swagger = Swagger()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
