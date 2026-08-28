from flask import Blueprint
from src.controllers.ats_controller import evaluate_ats_controller

ats_bp = Blueprint('ats', __name__)

ats_bp.route('/ats/score', methods=['POST'])(evaluate_ats_controller)
