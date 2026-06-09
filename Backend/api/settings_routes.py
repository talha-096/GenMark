import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_bcrypt import generate_password_hash, check_password_hash
from bson import ObjectId
from datetime import datetime
from core.extensions import db

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("/", methods=["GET"])
@jwt_required()
def get_settings():
    """
    Get user profile, subscription, and preferences settings
    """
    current_user_id = get_jwt_identity()
    user = db.db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    preferences = user.get("preferences", {})
    defaults = {
        "theme": "dark",
        "email_notifications": {
            "content_ready": True,
            "weekly_summary": False,
            "system_updates": True
        }
    }
    
    # Merge defaults
    for key, val in defaults.items():
        if key not in preferences:
            preferences[key] = val
        elif key == "email_notifications":
            for n_key, n_val in defaults["email_notifications"].items():
                if n_key not in preferences["email_notifications"]:
                    preferences["email_notifications"][n_key] = n_val
                    
    return jsonify({
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "subscription_plan": user.get("subscription_plan", "free"),
        "role": user.get("role", "user"),
        "preferences": preferences
    }), 200

@settings_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """
    Update user name and email address
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("name") or not data.get("email"):
        return jsonify({"message": "Name and email are required"}), 400
        
    name = data["name"].strip()
    email = data["email"].strip().lower()
    
    # Email format validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"message": "Invalid email address format"}), 400
        
    # Check if email is already in use by another user
    existing_user = db.db.users.find_one({"email": email})
    if existing_user and str(existing_user["_id"]) != current_user_id:
        return jsonify({"message": "Email is already in use by another account"}), 409
        
    db.db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {
            "name": name,
            "email": email,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return jsonify({"message": "Profile updated successfully", "name": name, "email": email}), 200

@settings_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    """
    Change current user's password securely
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("current_password") or not data.get("new_password"):
        return jsonify({"message": "Current and new passwords are required"}), 400
        
    current_password = data["current_password"]
    new_password = data["new_password"]
    
    if len(new_password) < 6:
        return jsonify({"message": "New password must be at least 6 characters long"}), 400
        
    user = db.db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    # Verify current password
    if not check_password_hash(user["password"], current_password):
        return jsonify({"message": "Incorrect current password"}), 401
        
    # Hash and save new password
    new_password_hash = generate_password_hash(new_password).decode('utf-8')
    db.db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {
            "password": new_password_hash,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return jsonify({"message": "Password changed successfully"}), 200

@settings_bp.route("/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():
    """
    Update theme and notification settings
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"message": "No preferences provided"}), 400
        
    theme = data.get("theme", "dark")
    email_notifications = data.get("email_notifications", {})
    
    preferences = {
        "theme": theme,
        "email_notifications": {
            "content_ready": bool(email_notifications.get("content_ready", True)),
            "weekly_summary": bool(email_notifications.get("weekly_summary", False)),
            "system_updates": bool(email_notifications.get("system_updates", True))
        }
    }
    
    db.db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {
            "preferences": preferences,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return jsonify({"message": "Preferences updated successfully", "preferences": preferences}), 200
