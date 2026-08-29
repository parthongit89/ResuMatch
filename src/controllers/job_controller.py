from flask import request
from src.utils.response_helpers import success_response, error_response
from src.services.job_service import JobService

def get_live_jobs_controller():
    """GET /api/v1/jobs Controller"""
    category = request.args.get('category', 'all')
    query = request.args.get('query', None)
    limit = request.args.get('limit', 20, type=int)

    success, message, result = JobService.fetch_live_jobs(
        category=category,
        query=query,
        limit=limit
    )

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)
