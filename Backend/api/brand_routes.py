from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.brand_kit import BrandKit
from bson import ObjectId

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
