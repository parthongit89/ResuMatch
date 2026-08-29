from flask import Blueprint
from src.controllers.job_controller import get_live_jobs_controller

job_bp = Blueprint('job', __name__)

job_bp.route('/jobs', methods=['GET'])(get_live_jobs_controller)
