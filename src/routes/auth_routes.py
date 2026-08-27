from flask import Blueprint
from src.controllers.auth_controller import (
    register_controller,
    login_controller,
    verify_otp_controller,
    resend_otp_controller,
    google_login_controller,
    get_current_user_controller,
    health_check_controller
)

# Blueprint for Authentication & System Verification Routes
auth_bp = Blueprint('auth', __name__)

# Register Endpoints
auth_bp.route('/auth/signup', methods=['POST'])(register_controller)
auth_bp.route('/auth/login', methods=['POST'])(login_controller)
auth_bp.route('/auth/verify-otp', methods=['POST'])(verify_otp_controller)
auth_bp.route('/auth/resend-otp', methods=['POST'])(resend_otp_controller)
auth_bp.route('/auth/google-login', methods=['POST'])(google_login_controller)
auth_bp.route('/auth/me', methods=['GET'])(get_current_user_controller)
auth_bp.route('/health', methods=['GET'])(health_check_controller)
