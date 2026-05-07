from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.llm_service import llm_service
from models.brand_kit import BrandKit
from models.marketing_content import MarketingContent
from datetime import datetime

generation_bp = Blueprint("generation", __name__)

@generation_bp.route("/text-to-text", methods=["POST"])
@jwt_required()
def generate_text_to_text():
    """Generate text from text prompt"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("prompt"):
        return jsonify({"message": "Prompt is required"}), 400
    
    brand_kit = _get_brand_kit(data.get("brand_kit_id"))
    
    result = llm_service.generate_text_to_text(
        prompt=data["prompt"],
        brand_kit=brand_kit,
        content_type=data.get("content_type", "text")
    )
    
    if "error" in result:
        return jsonify({"message": "Generation failed", "error": result["error"]}), 500
    
    # Save to database
    content_id = MarketingContent.create_content(
        user_id=user_id,
        title=f"Text Generation - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
        content=result["content"],
        content_type="text",
        brand_kit_id=data.get("brand_kit_id"),
        prompt=data["prompt"]
    )
    
    return jsonify({
        "id": str(content_id),
        "content": result["content"],
        "model": result.get("model"),
        "brand_applied": result.get("brand_applied", False)
    }), 200


@generation_bp.route("/text-to-image", methods=["POST"])
@jwt_required()
def generate_text_to_image():
    """Generate image from text prompt"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("prompt"):
        return jsonify({"message": "Prompt is required"}), 400
    
    brand_kit = _get_brand_kit(data.get("brand_kit_id"))
    
    result = llm_service.generate_text_to_image(
        prompt=data["prompt"],
        brand_kit=brand_kit
    )
    
    if "error" in result:
        return jsonify({"message": "Generation failed", "error": result["error"]}), 500
    
    # Save to database
    content_id = MarketingContent.create_content(
        user_id=user_id,
        title=f"Image Generation - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
        content=result.get("image_url", ""),
        content_type="image",
        brand_kit_id=data.get("brand_kit_id"),
        prompt=data["prompt"]
    )
    
    return jsonify({
        "success": True,
        "id": str(content_id),
        "content": result.get("image_url"),
        "image_url": result.get("image_url"),
        "model": result.get("model"),
        "brand_applied": result.get("brand_applied", False),
        "enhanced_prompt": result.get("enhanced_prompt")
    }), 200


@generation_bp.route("/image-to-text", methods=["POST"])
@jwt_required()
def generate_image_to_text():
    """Analyze image and generate text"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("image_url") or not data.get("prompt"):
        return jsonify({"message": "Image URL and prompt are required"}), 400
    
    brand_kit = _get_brand_kit(data.get("brand_kit_id"))
    
    result = llm_service.generate_image_to_text(
        image_url=data["image_url"],
        prompt=data["prompt"],
        brand_kit=brand_kit
    )
    
    if "error" in result:
        return jsonify({"message": "Analysis failed", "error": result["error"]}), 500
    
    # Save to database
    content_id = MarketingContent.create_content(
        user_id=user_id,
        title=f"Image Analysis - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
        content=result["content"],
        content_type="image_analysis",
        brand_kit_id=data.get("brand_kit_id"),
        prompt=data["prompt"]
    )
    
    return jsonify({
        "id": str(content_id),
        "content": result["content"],
        "model": result.get("model"),
        "brand_applied": result.get("brand_applied", False)
    }), 200


@generation_bp.route("/generate-ad", methods=["POST"])
@jwt_required()
def generate_ad():
    """Specific endpoint for ad generation using local or remote LLM"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    product = data.get("product")
    if not product:
        return jsonify({"message": "Product name is required"}), 400
    
    brand_kit = _get_brand_kit(data.get("brand_kit_id"))
    
    # Custom prompt for the ad copy as requested in the snippet
    prompt = f"Write a catchy 2-line Facebook ad for {product}."
    
    result = llm_service.generate_text_to_text(
        prompt=prompt,
        brand_kit=brand_kit,
        content_type="ad"
    )
    
    if "error" in result:
        return jsonify({"message": "Generation failed", "error": result["error"]}), 500
    
    # Save to history via MarketingContent
    content_id = MarketingContent.create_content(
        user_id=user_id,
        title=f"Ad Generation: {product}",
        content=result.get("content", ""),
        content_type="ad",
        brand_kit_id=data.get("brand_kit_id"),
        prompt=prompt
    )
    
    return jsonify({
        "id": str(content_id),
        "ad_copy": result.get("content"),
        "model": result.get("model"),
        "brand_applied": result.get("brand_applied", False)
    }), 200


@generation_bp.route("/history", methods=["GET"])
@jwt_required()
def get_generation_history():
    """Get user's generation history"""
    user_id = get_jwt_identity()
    limit = request.args.get("limit", 20, type=int)
    content_type = request.args.get("type")  # Filter by type
    
    contents = MarketingContent.get_by_user(user_id)
    
    # Filter by type if specified
    if content_type:
        contents = [c for c in contents if c.get("type") == content_type]
    
    # Limit results
    contents = contents[:limit]
    
    return jsonify([{
        "id": str(c["_id"]),
        "title": c.get("title"),
        "content": c.get("content"),
        "type": c.get("type"),
        "prompt": c.get("prompt"),
        "created_at": str(c.get("created_at")),
        "brand_kit_id": str(c["brand_kit_id"]) if c.get("brand_kit_id") else None
    } for c in contents]), 200


def _get_brand_kit(brand_kit_id):
    """Helper to get brand kit by ID"""
    if not brand_kit_id:
        return None
    
    brand_kit = BrandKit.get_by_id(brand_kit_id)
    return brand_kit
