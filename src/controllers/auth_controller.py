from flask import request
from marshmallow import ValidationError
from src.utils.response_helpers import success_response, error_response
from src.validators.auth_validator import SignUpSchema, SignInSchema, VerifyOTPSchema, ResendOTPSchema
from src.services.auth_service import AuthService

signUpSchema = SignUpSchema()
signInSchema = SignInSchema()
verifyOTPSchema = VerifyOTPSchema()
resendOTPSchema = ResendOTPSchema()

def register_controller():
    """POST /api/v1/auth/signup Controller"""
    try:
        data = signUpSchema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = AuthService.register_user(
        full_name=data['full_name'],
        email=data['email'],
        password=data['password']
    )

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=201)

def login_controller():
    """POST /api/v1/auth/login Controller"""
    try:
        data = signInSchema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = AuthService.login_user(
        email=data['email'],
        password=data['password']
    )

    if not success:
        return error_response(message=message, status_code=401)

    return success_response(data=result, message=message, status_code=200)

def verify_otp_controller():
    """POST /api/v1/auth/verify-otp Controller"""
    try:
        data = verifyOTPSchema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = AuthService.verify_otp(
        email=data['email'],
        otp_code=data['otp_code']
    )

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)

def resend_otp_controller():
    """POST /api/v1/auth/resend-otp Controller"""
    try:
        data = resendOTPSchema.load(request.get_json() or {})
    except ValidationError as err:
        return error_response(message="Validation error", errors=err.messages, status_code=422)

    success, message, result = AuthService.resend_otp(email=data['email'])

    if not success:
        return error_response(message=message, status_code=400)

    return success_response(data=result, message=message, status_code=200)

def health_check_controller():
    """GET /api/v1/health Controller (Silent Render Warm-up Endpoint)"""
    return success_response(
        data={"status": "active", "service": "ResuMatch Flask API Engine"},
        message="ResuMatch Flask Backend is awake and responsive",
        status_code=200
    )
