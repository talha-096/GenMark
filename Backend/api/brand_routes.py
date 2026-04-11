from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.brand_kit import BrandKit
from bson import ObjectId
from services.s3_service import S3Service
from datetime import datetime
import os

brand_bp = Blueprint("brand", __name__)

@brand_bp.route("/", methods=["POST"])
@jwt_required()
def create_brand_kit():
    """Create a new brand kit"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("name") or not data.get("colors"):
        return jsonify({"message": "Missing required fields (name, colors)"}), 400
        
    kit_id = BrandKit.create_brand_kit(
        user_id,
        data.get("project_id"),
        data["name"],
        data["colors"],
        data.get("fonts", []),
        data.get("logo_url")
    )
    
    return jsonify({"message": "Brand Kit created", "id": str(kit_id)}), 201

@brand_bp.route("/upload-logo", methods=["POST"])
@jwt_required()
def upload_logo():
    """Upload a logo to S3"""
    if "logo" not in request.files:
        return jsonify({"message": "No logo file provided"}), 400
        
    file = request.files["logo"]
    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400
        
    # Validate extension
    allowed_extensions = {".png", ".jpg", ".jpeg", ".svg"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        return jsonify({"message": f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"}), 400

    # Upload to S3
    s3 = S3Service()
    timestamp = int(datetime.utcnow().timestamp())
    # Clean filename to avoid issues
    clean_name = "".join(c for c in file.filename if c.isalnum() or c in "._-").strip()
    s3_path = f"logos/logo_{timestamp}_{clean_name}"
    
    success = s3.upload_file(file.read(), s3_path, content_type=file.content_type)
    
    if not success:
        return jsonify({"message": "Failed to upload to S3"}), 500
        
    logo_url = s3.get_presigned_url(s3_path)
    
    # Optional: Update brand kit if ID provided
    kit_id = request.form.get("kit_id")
    if kit_id:
        BrandKit.update_brand_kit(kit_id, {"logo_url": logo_url})
        
    return jsonify({
        "message": "Logo uploaded successfully",
        "logo_url": logo_url,
        "s3_path": s3_path # Returning S3 path for future reference
    }), 200

@brand_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_brand_kits():
    """List all brand kits for the current user"""
    user_id = get_jwt_identity()
    project_id = request.args.get("project_id")
    
    if project_id:
        kits = BrandKit.get_by_project(project_id)
    else:
        kits = BrandKit.get_by_user(user_id)
    
    for kit in kits:
        kit["_id"] = str(kit["_id"])
        kit["user_id"] = str(kit["user_id"])
        if kit.get("project_id"):
            kit["project_id"] = str(kit["project_id"])
            
    return jsonify(kits), 200

@brand_bp.route("/<kit_id>", methods=["GET"])
@jwt_required()
def get_brand_kit_details(kit_id):
    """Get single brand kit details"""
    user_id = get_jwt_identity()
    kit = BrandKit.get_by_id(kit_id)
    
    if not kit or str(kit["user_id"]) != user_id:
        return jsonify({"message": "Brand Kit not found or unauthorized"}), 404
        
    kit["_id"] = str(kit["_id"])
    kit["user_id"] = str(kit["user_id"])
    if kit.get("project_id"):
        kit["project_id"] = str(kit["project_id"])
        
    return jsonify(kit), 200

@brand_bp.route("/<kit_id>", methods=["PUT"])
@jwt_required()
def update_brand_kit(kit_id):
    """Update brand kit"""
    user_id = get_jwt_identity()
    kit = BrandKit.get_by_id(kit_id)
    
    if not kit or str(kit["user_id"]) != user_id:
        return jsonify({"message": "Brand Kit not found or unauthorized"}), 404
        
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 400
        
    BrandKit.update_brand_kit(kit_id, data)
    return jsonify({"message": "Brand Kit updated successfully"}), 200

@brand_bp.route("/<kit_id>", methods=["DELETE"])
@jwt_required()
def delete_brand_kit(kit_id):
    """Delete brand kit"""
    user_id = get_jwt_identity()
    kit = BrandKit.get_by_id(kit_id)
    
    if not kit or str(kit["user_id"]) != user_id:
        return jsonify({"message": "Brand Kit not found or unauthorized"}), 404
        
    BrandKit.delete_brand_kit(kit_id)
    return jsonify({"message": "Brand Kit deleted successfully"}), 200
