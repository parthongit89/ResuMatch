from marshmallow import Schema, fields, validate

class SignUpSchema(Schema):
    """Validation schema for Sign Up form (#signUpForm)"""
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6, max=100))

class SignInSchema(Schema):
    """Validation schema for Sign In form (#signInForm)"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class VerifyOTPSchema(Schema):
    """Validation schema for OTP verification form"""
    email = fields.Email(required=True)
    otp_code = fields.Str(required=True, validate=validate.Length(equal=6))

class ResendOTPSchema(Schema):
    """Validation schema for Resend OTP request"""
    email = fields.Email(required=True)
