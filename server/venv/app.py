from flask import Flask, jsonify
from flask_cors import CORS
from db import db
from models.forum_model import get_full_forum

# Import blueprints
from routes.category_routes import category_bp
from routes.topic_routes import topic_bp
from routes.forum_routes import forum_bp

app = Flask(__name__)
# CORS(app)
# CORS(app, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register all blueprints
app.register_blueprint(category_bp)
app.register_blueprint(topic_bp)
app.register_blueprint(forum_bp)

@app.route('/forum', methods=['GET'])
def get_forum():
    return jsonify(get_full_forum())

if __name__ == '__main__':
    app.run(debug=True)

