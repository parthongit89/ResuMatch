import os
import sys

# Ensure root directory is in sys.path for module resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.config.config import config_by_name
from src.config.database import db
from src.routes.auth_routes import auth_bp

def create_app(config_name=None):
    """Application Factory Function"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['development']))

    # Initialize Extensions
    db.init_app(app)
    JWTManager(app)

    # Enable CORS for Frontend Communication
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/v1')

    # Global Health Check at Root API Endpoint
    @app.route('/health', methods=['GET'])
    def root_health():
        return jsonify({
            "status": "healthy",
            "message": "ResuMatch API Server Running",
            "environment": config_name
        }), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "API Resource Not Found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "message": "Internal Server Error"}), 500

    # Create Database Tables if they don't exist
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    print(f"[ResuMatch Server] Running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
