import uuid
from datetime import datetime
from src.config.database import db

class ResumeDraft(db.Model):
    """Resume Draft Model representing the 4-Session Resume Creation State"""
    __tablename__ = 'resume_drafts'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), default="My Resume")
    current_session_step = db.Column(db.Integer, default=1)
    
    # Session 1 Inputs: Targeted Roles & Education
    targeted_roles = db.Column(db.Text, nullable=True)     # JSON string / comma separated
    education_data = db.Column(db.Text, nullable=True)     # JSON string

    # Session 2 Inputs: Technical Skills & External Links
    technical_skills = db.Column(db.Text, nullable=True)   # JSON string
    external_links = db.Column(db.Text, nullable=True)     # JSON string (GitHub, LinkedIn, Portfolio)

    # Session 3 Inputs: Experience & Certifications
    experience_data = db.Column(db.Text, nullable=True)    # JSON string
    certifications_data = db.Column(db.Text, nullable=True)# JSON string

    # Session 4 Inputs: Additional Certifications & Target Companies
    additional_certs = db.Column(db.Text, nullable=True)   # JSON string
    target_companies = db.Column(db.Text, nullable=True)   # JSON string

    # Selected Template Layout Key
    selected_template = db.Column(db.String(50), default="modern_minimalist")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        created_iso = self.created_at.isoformat() if self.created_at else datetime.utcnow().isoformat()
        updated_iso = self.updated_at.isoformat() if self.updated_at else datetime.utcnow().isoformat()
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "current_session_step": self.current_session_step,
            "session_1": {
                "targeted_roles": self.targeted_roles,
                "education_data": self.education_data
            },
            "session_2": {
                "technical_skills": self.technical_skills,
                "external_links": self.external_links
            },
            "session_3": {
                "experience_data": self.experience_data,
                "certifications_data": self.certifications_data
            },
            "session_4": {
                "additional_certs": self.additional_certs,
                "target_companies": self.target_companies
            },
            "selected_template": self.selected_template,
            "created_at": created_iso,
            "updated_at": updated_iso
        }
