# models/forum_model.py

from db import db
from bson import ObjectId

def get_full_forum():
    categories = list(db.categories.find())
    for cat in categories:
        cat["_id"] = str(cat["_id"])
        topics = list(db.topics.find({"categoryId": ObjectId(cat["_id"])}))
        cat["topics"] = [
            {
                "_id": str(topic["_id"]),
                "name": topic["name"],
                "language": topic.get("language", ""),
                "codebase": topic.get("codebase", ""),
                "output": topic.get("output", ""),
                "status": topic.get("status", "")
            }
            for topic in topics
        ]
    return categories
