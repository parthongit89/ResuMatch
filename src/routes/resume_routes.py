from flask import Blueprint
from src.controllers.resume_controller import (
    create_resume_controller,
    get_user_resumes_controller,
    get_resume_by_id_controller,
    update_resume_meta_controller,
    update_resume_session_step_controller,
    delete_resume_controller
)

# Blueprint for Resume Draft & Session Management Routes
resume_bp = Blueprint('resumes', __name__)

resume_bp.route('/resumes', methods=['POST'])(create_resume_controller)
resume_bp.route('/resumes', methods=['GET'])(get_user_resumes_controller)
resume_bp.route('/resumes/<draft_id>', methods=['GET'])(get_resume_by_id_controller)
resume_bp.route('/resumes/<draft_id>', methods=['PUT'])(update_resume_meta_controller)
resume_bp.route('/resumes/<draft_id>/session/step-<int:step>', methods=['PUT'])(update_resume_session_step_controller)
resume_bp.route('/resumes/<draft_id>', methods=['DELETE'])(delete_resume_controller)
