# routes/forum_routes.py
from flask import Blueprint, jsonify
from flask_cors import cross_origin
from bson import ObjectId
from db import db

def serialize_topic(topic):
    """Converts ObjectId fields in a topic document to strings."""
    # Ensure all ObjectId fields are converted to strings
    topic["_id"] = str(topic["_id"])
    if topic.get("categoryId"):
        topic["categoryId"] = str(topic["categoryId"])
    return topic

def serialize_category(cat):
    """Recursively converts ObjectId fields in a category document and its nested objects to strings."""
    out = {
        "_id": str(cat["_id"]),
        "name": cat.get("name"),
        "parentId": str(cat.get("parentId")) if cat.get("parentId") else None,
        "topics": [serialize_topic(t) for t in cat.get("topics", [])],
        # Recursively serialize subcategories
        "subcategories": [serialize_category(sub) for sub in cat.get("subcategories", [])]
    }
    return out

forum_bp = Blueprint("forum", __name__)

@forum_bp.route("/forum", methods=["GET"])
@cross_origin(origins="http://localhost:3000")
def get_forum_data():
    try:
        categories = list(db.categories.find())
        topics = list(db.topics.find())

        # Create a mapping for categories using their string ID
        category_map = {}
        for cat in categories:
            cid = str(cat["_id"])
            category_map[cid] = {**cat, "topics": [], "subcategories": []}

        # Attach topics to their respective categories
        for topic in topics:
            cat_id = str(topic.get("categoryId"))
            if cat_id in category_map:
                category_map[cat_id]["topics"].append(topic)
        
        # Build tree structure using parentId
        roots = []
        for cid, cat in category_map.items():
            parent = cat.get("parentId")
            if parent:
                parent_str = str(parent)
                if parent_str in category_map:
                    category_map[parent_str]["subcategories"].append(cat)
                else:
                    # If parent is invalid or missing, treat as a root
                    roots.append(cat)
            else:
                roots.append(cat)

        # Serialize the final array of root categories, which handles all nested ObjectIds
        result = [serialize_category(c) for c in roots]
        return jsonify(result), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500