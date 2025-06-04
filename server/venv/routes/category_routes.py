# routes/category_routes.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import db

category_bp = Blueprint("category", __name__)

@category_bp.route("/category", methods=["POST"])
@cross_origin(origins="http://localhost:3000")
def add_category():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    category = {"name": name}
    result = db.categories.insert_one(category)
    category["_id"] = str(result.inserted_id)

    return jsonify({"message": "Category added successfully", "category": category}), 201
