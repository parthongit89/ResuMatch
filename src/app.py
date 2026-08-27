import os
import sys

# Ensure root directory is in sys.path for module resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.config.config import config_by_name
from src.config.database import db
from src.routes.auth_routes import auth_bp

# Import models to ensure SQLAlchemy mappers are registered
import src.models.user
import src.models.resume

def create_app(config_name=None):
    """Application Factory Function"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    # Calculate Frontend Directory Path
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    frontend_dir = os.path.join(project_root, 'frontend', 'login_page')

    # Initialize Flask with isolated static_url_path to avoid route collision
    app = Flask(__name__, static_folder=frontend_dir, static_url_path='/static')
    app.config.from_object(config_by_name.get(config_name, config_by_name['development']))

    # Initialize Extensions
    db.init_app(app)
    JWTManager(app)

    # Enable CORS for Frontend Communication
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/v1')

    # Serve Login / Sign Up Page at Root URL, /login, /index.html, and /login.html
    @app.route('/')
    @app.route('/login')
    @app.route('/index.html')
    @app.route('/login.html')
    def serve_login_page():
        return send_from_directory(frontend_dir, 'index.html')

    # Serve Frontend Static Assets (style.css, script.js, images)
    @app.route('/<path:filename>')
    def serve_static_assets(filename):
        target_path = os.path.join(frontend_dir, filename)
        if os.path.exists(target_path):
            return send_from_directory(frontend_dir, filename)
        return jsonify({"success": False, "message": f"API Resource '{filename}' Not Found"}), 404

    # Global Error Handlers
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
