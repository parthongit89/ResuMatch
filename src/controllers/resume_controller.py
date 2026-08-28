from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from src.utils.response_helpers import success_response, error_response
from src.validators.resume_validator import (
    CreateResumeDraftSchema, UpdateResumeDraftSchema,
    SessionStep1Schema, SessionStep2Schema, SessionStep3Schema, SessionStep4Schema
)
from src.services.resume_service import ResumeService

createResumeDraftSchema = CreateResumeDraftSchema()
updateResumeDraftSchema = UpdateResumeDraftSchema()
step1Schema = SessionStep1Schema()
step2Schema = SessionStep2Schema()
step3Schema = SessionStep3Schema()
step4Schema = SessionStep4Schema()

@jwt_required(optional=True)
def create_resume_controller():
    """POST /api/v1/resumes"""
    current_user = get_jwt_identity()
    user_id = current_user if current_user else "demo_guest_user"
    
    req_json = request.get_json() or {}
    try:
        data = createResumeDraftSchema.load(req_json)
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = ResumeService.create_draft(user_id=user_id, title=data.get("title"))
    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=201)

@jwt_required(optional=True)
def get_user_resumes_controller():
    """GET /api/v1/resumes"""
    current_user = get_jwt_identity()
    user_id = current_user if current_user else "demo_guest_user"

    success, message, result = ResumeService.get_user_drafts(user_id=user_id)
    return success_response(data=result, message=message, status_code=200)

@jwt_required(optional=True)
def get_resume_by_id_controller(draft_id):
    """GET /api/v1/resumes/<id>"""
    current_user = get_jwt_identity()
    user_id = current_user if current_user else None

    success, message, result = ResumeService.get_draft_by_id(draft_id=draft_id, user_id=user_id)
    if not success:
        return error_response(message=message, status_code=404)

    return success_response(data=result, message=message, status_code=200)

@jwt_required(optional=True)
def update_resume_meta_controller(draft_id):
    """PUT /api/v1/resumes/<id>"""
    current_user = get_jwt_identity()
    user_id = current_user if current_user else None

    req_json = request.get_json() or {}
    try:
        data = updateResumeDraftSchema.load(req_json)
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = ResumeService.update_draft(draft_id=draft_id, data=data, user_id=user_id)
    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)

@jwt_required(optional=True)
def update_resume_session_step_controller(draft_id, step):
    """PUT /api/v1/resumes/<id>/session/step-<step>"""
    current_user = get_jwt_identity()
    user_id = current_user if current_user else None
    
    req_json = request.get_json() or {}
    
    # Schema validation based on step number
    step_schemas = {
        1: step1Schema,
        2: step2Schema,
        3: step3Schema,
        4: step4Schema
    }
    schema = step_schemas.get(step)
    if not schema:
        return error_response(message=f"Invalid session step '{step}'. Allowed steps: 1 to 4", status_code=400)

    try:
        validated_data = schema.load(req_json)
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = ResumeService.update_session_step(
        draft_id=draft_id,
        step=step,
        data=validated_data,
        user_id=user_id
    )

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)

@jwt_required(optional=True)
def delete_resume_controller(draft_id):
    """DELETE /api/v1/resumes/<id>"""
    current_user = get_jwt_identity()
    user_id = current_user if current_user else None

    success, message, result = ResumeService.delete_draft(draft_id=draft_id, user_id=user_id)
    if not success:
        return error_response(message=message, status_code=404)

    return success_response(data=result, message=message, status_code=200)
