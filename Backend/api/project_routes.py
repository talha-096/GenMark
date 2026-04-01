from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.project import Project
from bson import ObjectId

project_bp = Blueprint("project", __name__)

@project_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_projects():
    """List all projects for the current user"""
    user_id = get_jwt_identity()
    projects = Project.get_by_user(user_id)
    
    # Convert ObjectIds to strings
    for project in projects:
        project["_id"] = str(project["_id"])
        project["user_id"] = str(project["user_id"])
        
    return jsonify(projects), 200

@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():
    """Create a new project"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get("name"):
        return jsonify({"message": "Project name is required"}), 400
        
    project_id = Project.create_project(
        user_id,
        data["name"],
        data.get("description")
    )
    
    return jsonify({
        "message": "Project created successfully",
        "id": str(project_id)
    }), 201

@project_bp.route("/<project_id>", methods=["GET"])
@jwt_required()
def get_project_details(project_id):
    """Get project by ID"""
    user_id = get_jwt_identity()
    project = Project.get_by_id(project_id)
    
    if not project or str(project["user_id"]) != user_id:
        return jsonify({"message": "Project not found or unauthorized"}), 404
        
    project["_id"] = str(project["_id"])
    project["user_id"] = str(project["user_id"])
    
    return jsonify(project), 200

@project_bp.route("/<project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    """Update project details"""
    user_id = get_jwt_identity()
    project = Project.get_by_id(project_id)
    
    if not project or str(project["user_id"]) != user_id:
        return jsonify({"message": "Project not found or unauthorized"}), 404
        
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 400
        
    Project.update_project(project_id, data)
    return jsonify({"message": "Project updated successfully"}), 200

@project_bp.route("/<project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    """Delete a project"""
    user_id = get_jwt_identity()
    project = Project.get_by_id(project_id)
    
    if not project or str(project["user_id"]) != user_id:
        return jsonify({"message": "Project not found or unauthorized"}), 404
        
    Project.delete_project(project_id)
    return jsonify({"message": "Project deleted successfully"}), 200
