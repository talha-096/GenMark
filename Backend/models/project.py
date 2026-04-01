from core.extensions import db
from datetime import datetime
from bson import ObjectId

class Project:
    @staticmethod
    def create_project(user_id, name, description=None):
        projects = db.projects
        project_id = projects.insert_one({
            "user_id": ObjectId(user_id),
            "name": name,
            "description": description,
            "status": "active", # active, archived
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }).inserted_id
        return project_id

    @staticmethod
    def get_by_user(user_id):
        return list(db.projects.find({"user_id": ObjectId(user_id)}).sort("created_at", -1))

    @staticmethod
    def get_by_id(project_id):
        return db.projects.find_one({"_id": ObjectId(project_id)})

    @staticmethod
    def update_project(project_id, data):
        data["updated_at"] = datetime.utcnow()
        # Ensure we don't accidentally update things we shouldn't
        forbidden_keys = ["_id", "user_id", "created_at"]
        for key in forbidden_keys:
            data.pop(key, None)
            
        return db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": data}
        )

    @staticmethod
    def delete_project(project_id):
        # Soft delete or hard delete? Let's do hard delete for now as per simple CRUD
        return db.projects.delete_one({"_id": ObjectId(project_id)})
