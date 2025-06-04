from flask import Blueprint, request, jsonify
from db import db

list_bp = Blueprint('list', __name__)

@list_bp.route('/list', methods=['POST'])
def add_list():
    data = request.json
    result = db.lists.insert_one({
        'title': data['title'],
        'topicId': data['topicId']
    })
    return jsonify({'_id': str(result.inserted_id)})
