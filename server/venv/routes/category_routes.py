# routes/category_routes.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from bson import ObjectId
from db import db

category_bp = Blueprint("category", __name__)


@category_bp.route("/category", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:3000")
def add_category():
    if request.method == "OPTIONS":
        return '', 200

    data = request.json or {}
    name = data.get("name")
    parent_id = data.get("parentId") or data.get("parent_id")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    category = {"name": name}

    # If parentId was provided, validate and store as ObjectId
    if parent_id:
        try:
            parent_obj = ObjectId(parent_id)
        except Exception:
            return jsonify({"error": "Invalid parentId"}), 400

        parent_exists = db.categories.find_one({"_id": parent_obj})
        if not parent_exists:
            return jsonify({"error": "Parent category not found"}), 400

        category["parentId"] = parent_obj

    result = db.categories.insert_one(category)
    category["_id"] = str(result.inserted_id)

    # convert parentId for response to string if present
    if category.get("parentId"):
        category["parentId"] = str(category["parentId"])

    return jsonify({"message": "Category added successfully", "category": category}), 201
