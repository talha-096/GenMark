from core.extensions import db
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create_user(name, email, password):
        users = db.db.users
        
        # Check if user exists
        try:
            if users.find_one({"email": email}):
                return None
        except Exception as e:
            print(f"Database error: {e}")
            raise Exception("Database connection failed. Please ensure MongoDB is running.")
            
        password_hash = generate_password_hash(password).decode('utf-8')
        
        user_id = users.insert_one({
            "name": name,
            "email": email,
            "password": password_hash,
            "created_at": datetime.utcnow(),
            "role": "user",
            "onboarding_completed": False,
            "subscription_plan": "free",  # free, pro, enterprise
            "subscription_status": "active", # active, past_due, canceled
            "subscription_end_date": None,
            "stripe_customer_id": None
        }).inserted_id
        
        return user_id

    @staticmethod
    def get_by_email(email):
        return db.db.users.find_one({"email": email})

    @staticmethod
    def verify_user(email, password):
        users = db.db.users
        user = users.find_one({"email": email})
        
        if user and check_password_hash(user['password'], password):
            return user
        return None

    @staticmethod
    def update_last_login(user_id):
        return db.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"last_login": datetime.utcnow()}}
        )

    @staticmethod
    def update_profile(user_id, profile_data):
        return db.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "profile": profile_data,
                "onboarding_completed": True,
                "updated_at": datetime.utcnow()
            }}
        )

    @staticmethod
    def get_by_id(user_id):
        users = db.db.users
        return users.find_one({"_id": ObjectId(user_id)})
