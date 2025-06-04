# routes/topic_routes.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from bson import ObjectId
from db import db

topic_bp = Blueprint("topic", __name__)

def serialize_topic(topic):
    """Convert ObjectId fields to strings for JSON serialization"""
    topic["_id"] = str(topic["_id"])
    topic["categoryId"] = str(topic["categoryId"])
    return topic

@topic_bp.route("/topic", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:3000")
def add_topic():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.json
        topic = {
            "name": data.get("name"),
            "categoryId": ObjectId(data.get("categoryId")),
            "language": data.get("language", ""),
            "codebase": data.get("codebase", ""),
            "output": data.get("output", ""),
            "status": data.get("status", "active"),
        }

        result = db.topics.insert_one(topic)
        topic["_id"] = result.inserted_id

        return jsonify({
            "message": "Topic added successfully",
            "topic": serialize_topic(topic)
        }), 201

    except Exception as e:
        print("Error adding topic:", e)
        return jsonify({"error": "Internal server error"}), 500

