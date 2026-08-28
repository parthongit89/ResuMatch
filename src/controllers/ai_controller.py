from flask import request
from marshmallow import ValidationError
from src.utils.response_helpers import success_response, error_response
from src.validators.resume_validator import AIEnhanceSchema
from src.services.ai_service import AIService

aiEnhanceSchema = AIEnhanceSchema()

def enhance_text_controller():
    """POST /api/v1/ai/enhance Controller"""
    req_json = request.get_json() or {}
    try:
        data = aiEnhanceSchema.load(req_json)
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = AIService.enhance_text(
        text=data['text'],
        enhance_type=data.get('type', 'summary'),
        target_role=data.get('target_role')
    )

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)
