from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.marketing_content import MarketingContent
from bson import ObjectId

content_bp = Blueprint("content", __name__)

@content_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_content():
    """List all content for the current user"""
    user_id = get_jwt_identity()
    project_id = request.args.get("project_id")
    
    if project_id:
        content_items = MarketingContent.get_by_project(project_id)
    else:
        content_items = MarketingContent.get_by_user(user_id)
        
    for item in content_items:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
        if item.get("project_id"):
            item["project_id"] = str(item["project_id"])
        if item.get("brand_kit_id"):
            item["brand_kit_id"] = str(item["brand_kit_id"])
            
    return jsonify(content_items), 200

@content_bp.route("/<content_id>", methods=["GET"])
@jwt_required()
def get_content_details(content_id):
    """Get single content item details"""
    user_id = get_jwt_identity()
    item = MarketingContent.get_by_id(content_id)
    
    if not item or str(item["user_id"]) != user_id:
        return jsonify({"message": "Content not found"}), 404
        
    item["_id"] = str(item["_id"])
    item["user_id"] = str(item["user_id"])
    if item.get("project_id"):
        item["project_id"] = str(item["project_id"])
    if item.get("brand_kit_id"):
        item["brand_kit_id"] = str(item["brand_kit_id"])
        
    return jsonify(item), 200

@content_bp.route("/", methods=["POST"])
@jwt_required()
def create_content():
    """Manually create content or save generated content"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("title") or not data.get("content"):
        return jsonify({"message": "Missing title or content"}), 400
        
    content_id = MarketingContent.create_content(
        user_id,
        data["title"],
        data["content"],
        content_type=data.get("type", "text"),
        brand_kit_id=data.get("brand_kit_id"),
        project_id=data.get("project_id"),
        prompt=data.get("prompt")
    )
    
    return jsonify({"message": "Content created", "id": str(content_id)}), 201

@content_bp.route("/<content_id>", methods=["PUT"])
@jwt_required()
def update_content(content_id):
    """Update content item"""
    user_id = get_jwt_identity()
    item = MarketingContent.get_by_id(content_id)
    
    if not item or str(item["user_id"]) != user_id:
        return jsonify({"message": "Content not found"}), 404
        
    data = request.get_json()
    MarketingContent.update_content(content_id, data)
    return jsonify({"message": "Content updated successfully"}), 200

@content_bp.route("/<content_id>", methods=["DELETE"])
@jwt_required()
def delete_content(content_id):
    """Delete content item"""
    user_id = get_jwt_identity()
    item = MarketingContent.get_by_id(content_id)
    
    if not item or str(item["user_id"]) != user_id:
        return jsonify({"message": "Content not found"}), 404
        
    MarketingContent.delete_content(content_id)
    return jsonify({"message": "Content deleted successfully"}), 200

@content_bp.route("/<content_id>/comments", methods=["POST"])
@jwt_required()
def add_comment(content_id):
    """Add a comment/note to content"""
    data = request.get_json()
    user_id = get_jwt_identity()
    
    if not data or not data.get("text"):
        return jsonify({"message": "Missing comment text"}), 400
        
    MarketingContent.add_comment(content_id, user_id, data["text"])
    return jsonify({"message": "Comment added"}), 201
