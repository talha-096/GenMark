from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from core.extensions import limiter
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
def register():
    """
    Register a new user
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
            - password
          properties:
            name:
              type: string
              example: "John Doe"
            email:
              type: string
              format: email
              example: "john@example.com"
            password:
              type: string
              format: password
              example: "securepass123"
    responses:
      201:
        description: User registered successfully
      400:
        description: Missing required fields
      409:
        description: User already exists
    """
    data = request.get_json()
    
    if not data or not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"message": "Missing required fields"}), 400
        
    user_id = User.create_user(data["name"], data["email"], data["password"])
    
    if not user_id:
        return jsonify({"message": "User already exists"}), 409
        
    # Auto login after register
    access_token = create_access_token(identity=str(user_id), expires_delta=timedelta(days=1))
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": {
            "name": data["name"], 
            "email": data["email"],
            "onboarding_completed": False,
            "subscription_plan": "free"
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    """
    Authenticate user and return JWT
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: "john@example.com"
            password:
              type: string
              example: "securepass123"
    responses:
      200:
        description: Login successful
      401:
        description: Invalid credentials
    """
    data = request.get_json()
    print(f"DEBUG: Login request received for email: {data.get('email') if data else 'None'}")
    
    if not data or not data.get("email") or not data.get("password"):
        print(f"DEBUG: Login failed due to missing credentials in body")
        return jsonify({"message": "Missing email or password"}), 400
        
    # First check if user exists
    user = User.get_by_email(data["email"])
    if not user:
        print(f"DEBUG: Login failed: No account found for {data['email']}")
        return jsonify({"message": "Account not found. Please register first."}), 401
        
    # User exists, now verify password
    user = User.verify_user(data["email"], data["password"])
    if not user:
        print(f"DEBUG: Login failed: Invalid password for {data['email']}")
        return jsonify({"message": "Invalid password."}), 401
        
    User.update_last_login(user["_id"])
    access_token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=1))
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "name": user["name"], 
            "email": user["email"],
            "onboarding_completed": user.get("onboarding_completed", False),
            "subscription_plan": user.get("subscription_plan", "free")
        }
    }), 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    """
    Get current user profile
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: Profile retrieved
    """
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    return jsonify({
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "subscription_plan": user.get("subscription_plan", "free"),
        "created_at": user.get("created_at"),
        "onboarding_completed": user.get("onboarding_completed", False)
    }), 200

@auth_bp.route("/check-email", methods=["POST"])
def check_email():
    """Check if email is already registered"""
    data = request.get_json()
    if not data or not data.get("email"):
        return jsonify({"exists": False}), 200
    user = User.get_by_email(data["email"])
    return jsonify({"exists": bool(user)}), 200

@auth_bp.route("/onboarding", methods=["POST"])
@jwt_required()
def submit_onboarding():
    """Complete user onboarding"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 400
    User.update_profile(current_user_id, data)
    return jsonify({"message": "Onboarding completed successfully"}), 200
