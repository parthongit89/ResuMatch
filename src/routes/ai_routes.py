from flask import Blueprint
from src.controllers.ai_controller import enhance_text_controller

ai_bp = Blueprint('ai', __name__)

ai_bp.route('/ai/enhance', methods=['POST'])(enhance_text_controller)
