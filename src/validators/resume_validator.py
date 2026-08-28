from marshmallow import Schema, fields, validate

class CreateResumeDraftSchema(Schema):
    """Validation schema for creating a new resume draft"""
    title = fields.Str(required=False, validate=validate.Length(max=150))

class UpdateResumeDraftSchema(Schema):
    """Validation schema for updating base resume draft metadata"""
    title = fields.Str(required=False, validate=validate.Length(max=150))
    selected_template = fields.Str(required=False, validate=validate.Length(max=50))
    current_session_step = fields.Int(required=False, validate=validate.Range(min=1, max=4))

class SessionStep1Schema(Schema):
    """Session Step 1: Targeted Roles & Education"""
    targeted_roles = fields.Raw(required=False)
    education_data = fields.Raw(required=False)

class SessionStep2Schema(Schema):
    """Session Step 2: Technical Skills & External Links"""
    technical_skills = fields.Raw(required=False)
    external_links = fields.Raw(required=False)

class SessionStep3Schema(Schema):
    """Session Step 3: Experience & Certifications"""
    experience_data = fields.Raw(required=False)
    certifications_data = fields.Raw(required=False)

class SessionStep4Schema(Schema):
    """Session Step 4: Additional Certifications & Target Companies"""
    additional_certs = fields.Raw(required=False)
    target_companies = fields.Raw(required=False)

class AIEnhanceSchema(Schema):
    """Validation schema for AI enhancement requests"""
    text = fields.Str(required=True, validate=validate.Length(min=3))
    type = fields.Str(required=False, validate=validate.OneOf(["summary", "bullet", "skills"]))
    target_role = fields.Str(required=False)

class ATSScoreSchema(Schema):
    """Validation schema for ATS Matcher scoring requests"""
    resume_text = fields.Str(required=True, validate=validate.Length(min=10))
    job_description = fields.Str(required=True, validate=validate.Length(min=10))
