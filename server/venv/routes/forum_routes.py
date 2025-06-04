# routes/forum_routes.py
from flask import Blueprint, jsonify
from flask_cors import cross_origin
from bson import ObjectId
from db import db

forum_bp = Blueprint("forum", __name__)

def serialize_topic(topic):
    topic["_id"] = str(topic["_id"])
    topic["categoryId"] = str(topic["categoryId"])
    return topic

def serialize_category(category):
    category["_id"] = str(category["_id"])
    category["topics"] = [serialize_topic(t) for t in category.get("topics", [])]
    return category

@forum_bp.route("/forum", methods=["GET"])
@cross_origin(origins="http://localhost:3000")
def get_forum_data():
    try:
        categories = list(db.categories.find())
        topics = list(db.topics.find())

        category_map = {str(cat["_id"]): {**cat, "topics": []} for cat in categories}

        for topic in topics:
            cat_id = str(topic["categoryId"])
            if cat_id in category_map:
                category_map[cat_id]["topics"].append(topic)

        result = [serialize_category(cat) for cat in category_map.values()]

        return jsonify(result), 200

    except Exception as e:
        print("Error fetching forum data:", e)
        return jsonify({"error": "Internal server error"}), 500
