from flask import request
from marshmallow import ValidationError
from src.utils.response_helpers import success_response, error_response
from src.validators.resume_validator import ATSScoreSchema
from src.services.ats_service import ATSService

atsScoreSchema = ATSScoreSchema()

def evaluate_ats_controller():
    """POST /api/v1/ats/score Controller"""
    req_json = request.get_json() or {}
    try:
        data = atsScoreSchema.load(req_json)
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = ATSService.evaluate_match(
        resume_text=data['resume_text'],
        job_description=data['job_description']
    )

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)
