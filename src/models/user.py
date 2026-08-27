import uuid
from datetime import datetime, timedelta
from src.config.database import db

class User(db.Model):
    """User Model representing registered job seekers"""
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    resumes = db.relationship('ResumeDraft', backref='user', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat()
        }

class OTPSession(db.Model):
    """OTP Verification Session Model for Email Verification"""
    __tablename__ = 'otp_sessions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), nullable=False, index=True)
    otp_code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @classmethod
    def create_otp(cls, email, otp_code, valid_minutes=10):
        expires_at = datetime.utcnow() + timedelta(minutes=valid_minutes)
        session = cls(email=email, otp_code=otp_code, expires_at=expires_at)
        db.session.add(session)
        db.session.commit()
        return session
