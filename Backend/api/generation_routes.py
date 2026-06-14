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
    
    brand_kit, err = _resolve_brand_kit(data.get("brand_kit_id"), user_id)
    if err:
        # err is a tuple (response, status_code) from _resolve_brand_kit
        return err if isinstance(err, tuple) else (err, 400)

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

    # Build brand summary for the response
    brand_summary = None
    if brand_kit:
        brand_summary = {
            "id": str(brand_kit.get("_id")),
            "name": brand_kit.get("name"),
            "colors": brand_kit.get("colors", [])
        }

    return jsonify({
        "id": str(content_id),
        "content": result["content"],
        "model": result.get("model"),
        "brand_applied": brand_kit is not None,
        "brand_kit": brand_summary
    }), 200


@generation_bp.route("/text-to-image", methods=["POST"])
@jwt_required()
def generate_text_to_image():
    """Generate image from text prompt"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("prompt"):
        return jsonify({"message": "Prompt is required"}), 400
    
    brand_kit, err = _resolve_brand_kit(data.get("brand_kit_id"), user_id)
    if err:
        return err if isinstance(err, tuple) else (err, 400)

    aspect_ratio = data.get("aspect_ratio", "1:1")

    result = llm_service.generate_text_to_image(
        prompt=data["prompt"],
        brand_kit=brand_kit,
        aspect_ratio=aspect_ratio
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
        prompt=data["prompt"],
        aspect_ratio=aspect_ratio
    )

    brand_summary = None
    if brand_kit:
        brand_summary = {
            "id": str(brand_kit.get("_id")),
            "name": brand_kit.get("name"),
            "colors": brand_kit.get("colors", [])
        }

    return jsonify({
        "success": True,
        "id": str(content_id),
        "content": result.get("image_url"),
        "image_url": result.get("image_url"),
        "model": result.get("model"),
        "brand_applied": brand_kit is not None,
        "brand_kit": brand_summary,
        "enhanced_prompt": result.get("enhanced_prompt")
    }), 200


@generation_bp.route("/edit-image", methods=["POST"])
@jwt_required()
def edit_image():
    """Edit an image using image-to-image generation"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("prompt") or not data.get("image_url"):
        return jsonify({"message": "Prompt and Image URL are required"}), 400
    
    brand_kit, err = _resolve_brand_kit(data.get("brand_kit_id"), user_id)
    if err:
        return err if isinstance(err, tuple) else (err, 400)

    result = llm_service.generate_image_to_image(
        image_url=data["image_url"],
        prompt=data["prompt"],
        brand_kit=brand_kit
    )

    if not result.get("success"):
        return jsonify({"message": "Generation failed", "error": result.get("error")}), 500

    # Save to database
    content_id = MarketingContent.create_content(
        user_id=user_id,
        title=f"Image Edit - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
        content=result.get("content", ""),
        content_type="image",
        brand_kit_id=data.get("brand_kit_id"),
        prompt=data["prompt"]
    )

    return jsonify({
        "success": True,
        "id": str(content_id),
        "content": result.get("content"),
        "model": result.get("model"),
        "brand_applied": brand_kit is not None
    }), 200

@generation_bp.route("/upload-image", methods=["POST"])
@jwt_required()
def upload_image():
    """Upload an image to S3 for image-to-text analysis"""
    import os
    import logging
    import traceback
    from services.s3_service import S3Service
    
    if "image" not in request.files:
        return jsonify({"message": "No image file provided"}), 400
        
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400
        
    # Validate extension
    allowed_extensions = {".png", ".jpg", ".jpeg", ".webp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        return jsonify({"message": f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"}), 400

    try:
        # Upload to S3
        s3 = S3Service()
        logging.info(f"Upload attempt: bucket={s3.bucket_name}, region={s3.region}")
        timestamp = int(datetime.utcnow().timestamp())
        clean_name = "".join(c for c in file.filename if c.isalnum() or c in "._-").strip()
        s3_path = f"uploads/img_{timestamp}_{clean_name}"
        
        file_bytes = file.read()
        logging.info(f"File size: {len(file_bytes)} bytes, content_type={file.content_type}")
        
        success = s3.upload_file(file_bytes, s3_path, content_type=file.content_type)
        
        if not success:
            logging.error(f"S3 upload returned False for path: {s3_path}")
            return jsonify({"message": "Failed to upload to S3", "detail": f"bucket={s3.bucket_name}, region={s3.region}"}), 500
            
        image_url = s3.get_presigned_url(s3_path)
        
        return jsonify({
            "message": "Image uploaded successfully",
            "image_url": image_url,
            "s3_path": s3_path
        }), 200

    except Exception as e:
        tb = traceback.format_exc()
        logging.error(f"Upload route exception: {e}\n{tb}")
        return jsonify({"message": "Upload exception", "error": str(e), "traceback": tb}), 500



@generation_bp.route("/image-to-text", methods=["POST"])
@jwt_required()
def generate_image_to_text():
    """Analyze image and generate text"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("image_url") or not data.get("prompt"):
        return jsonify({"message": "Image URL and prompt are required"}), 400
    
    brand_kit, err = _resolve_brand_kit(data.get("brand_kit_id"), user_id)
    if err:
        return err if isinstance(err, tuple) else (err, 400)

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
        prompt=data["prompt"],
        image_url=data["image_url"],
        selected_task=data.get("selected_task")
    )

    brand_summary = None
    if brand_kit:
        brand_summary = {
            "id": str(brand_kit.get("_id")),
            "name": brand_kit.get("name"),
            "colors": brand_kit.get("colors", [])
        }

    return jsonify({
        "id": str(content_id),
        "content": result["content"],
        "model": result.get("model"),
        "brand_applied": brand_kit is not None,
        "brand_kit": brand_summary
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
    
    brand_kit, err = _resolve_brand_kit(data.get("brand_kit_id"), user_id)
    if err:
        return err if isinstance(err, tuple) else (err, 400)

    # Build a brand-aware ad prompt
    brand_name = brand_kit.get("name", product) if brand_kit else product
    prompt = f"Write a catchy 2-line Facebook ad for {product} by {brand_name}."

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

    brand_summary = None
    if brand_kit:
        brand_summary = {
            "id": str(brand_kit.get("_id")),
            "name": brand_kit.get("name"),
            "colors": brand_kit.get("colors", [])
        }

    return jsonify({
        "id": str(content_id),
        "ad_copy": result.get("content"),
        "model": result.get("model"),
        "brand_applied": brand_kit is not None,
        "brand_kit": brand_summary
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
        "brand_kit_id": str(c["brand_kit_id"]) if c.get("brand_kit_id") else None,
        "image_url": c.get("image_url"),
        "aspect_ratio": c.get("aspect_ratio"),
        "marketing_copy": c.get("marketing_copy"),
        "selected_task": c.get("selected_task")
    } for c in contents]), 200


def _get_brand_kit(brand_kit_id):
    """Helper to get brand kit by ID (no ownership check — for internal use only)."""
    if not brand_kit_id:
        return None
    brand_kit = BrandKit.get_by_id(brand_kit_id)
    return brand_kit


def _resolve_brand_kit(brand_kit_id, user_id, require_brand=False):
    """Resolve and validate a brand kit, enforcing ownership.
    
    Args:
        brand_kit_id: The kit ObjectId string from the request.
        user_id:      The JWT identity of the authenticated user.
        require_brand: If True, returns (None, error_response) when no valid
                       brand kit can be resolved so the caller can abort.
    
    Returns:
        (brand_kit_dict, None)   — on success.
        (None, jsonify_error)    — when require_brand=True and kit is missing/invalid.
        (None, None)             — when brand_kit_id is absent and require_brand=False.
    """
    if not brand_kit_id:
        if require_brand:
            return None, jsonify({
                "message": "A brand kit is required for this generation. "
                           "Please select one of your brand kits before generating."
            }), 400
        return None, None

    kit = BrandKit.get_by_id(brand_kit_id)

    if not kit:
        return None, (jsonify({"message": "Brand kit not found. It may have been deleted."}), 404)

    if str(kit.get("user_id")) != user_id:
        return None, (jsonify({"message": "You are not authorized to use this brand kit."}), 403)

    return kit, None

