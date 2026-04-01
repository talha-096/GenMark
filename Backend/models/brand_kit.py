from core.extensions import db
from datetime import datetime
from bson import ObjectId

class BrandKit:
    @staticmethod
    def create_brand_kit(user_id, project_id, name, colors, fonts, logo_url=None):
        brand_kits = db.brand_kits
        kit_id = brand_kits.insert_one({
            "user_id": ObjectId(user_id),
            "project_id": ObjectId(project_id) if project_id else None,
            "name": name,
            "colors": colors, # List of hex codes e.g. ["#FF0000", "#00FF00"]
            "fonts": fonts,   # List of font families e.g. ["Roboto", "Inter"]
            "logo_url": logo_url,
            "guidelines": "", # Optional text guidelines
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }).inserted_id
        return kit_id

    @staticmethod
    def get_by_user(user_id):
        return list(db.brand_kits.find({"user_id": ObjectId(user_id)}))
        
    @staticmethod
    def get_by_project(project_id):
        return list(db.brand_kits.find({"project_id": ObjectId(project_id)}))

    @staticmethod
    def get_by_id(kit_id):
        return db.brand_kits.find_one({"_id": ObjectId(kit_id)})

    @staticmethod
    def update_brand_kit(kit_id, data):
        data["updated_at"] = datetime.utcnow()
        # Clean data
        for key in ["_id", "user_id", "project_id"]:
            data.pop(key, None)
            
        return db.brand_kits.update_one(
            {"_id": ObjectId(kit_id)},
            {"$set": data}
        )

    @staticmethod
    def delete_brand_kit(kit_id):
        return db.brand_kits.delete_one({"_id": ObjectId(kit_id)})
