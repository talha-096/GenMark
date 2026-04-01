from core.extensions import db
from datetime import datetime
from bson import ObjectId

class MarketingContent:
    @staticmethod
    def create_content(user_id, title, content, content_type="text", brand_kit_id=None, project_id=None, prompt=None):
        posts = db.posts
        post_id = posts.insert_one({
            "user_id": ObjectId(user_id),
            "project_id": ObjectId(project_id) if project_id else None,
            "title": title,
            "content": content,
            "type": content_type,
            "brand_kit_id": ObjectId(brand_kit_id) if brand_kit_id else None,
            "prompt": prompt,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "comments": []
        }).inserted_id
        return post_id

    @staticmethod
    def get_by_user(user_id, limit=None):
        query = {"user_id": ObjectId(user_id)}
        cursor = db.posts.find(query).sort("created_at", -1)
        if limit:
            cursor = cursor.limit(limit)
        return list(cursor)

    @staticmethod
    def get_by_project(project_id):
        return list(db.posts.find({"project_id": ObjectId(project_id)}).sort("created_at", -1))

    @staticmethod
    def update_content(post_id, data):
        data["updated_at"] = datetime.utcnow()
        for key in ["_id", "user_id"]:
            data.pop(key, None)
        return db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": data}
        )

    @staticmethod
    def delete_content(post_id):
        return db.posts.delete_one({"_id": ObjectId(post_id)})

    @staticmethod
    def get_all():
        # Join with user to get auther name if needed (simple version here)
        return list(db.posts.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            {"$unwind": "$author"},
            {"$project": {"author.password": 0}},
            {"$sort": {"created_at": -1}}
        ]))

    @staticmethod
    def get_by_id(post_id):
        return db.posts.find_one({"_id": ObjectId(post_id)})

    @staticmethod
    def add_comment(post_id, user_id, text):
        return db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$push": {
                "comments": {
                    "_id": ObjectId(),
                    "user_id": ObjectId(user_id),
                    "text": text,
                    "created_at": datetime.utcnow()
                }
            }}
        )
