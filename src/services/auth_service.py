import bcrypt
from datetime import datetime
from flask_jwt_extended import create_access_token
from src.config.database import db
from src.models.user import User, OTPSession
from src.utils.otp_generator import generate_otp
from src.utils.email_sender import send_otp_email

class AuthService:
    """Service handling User Registration, Login, OTP Generation & Verification"""

    @staticmethod
    def register_user(full_name, email, password):
        """Registers a new user and sends an OTP verification email"""
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return False, "User with this email already exists", None

        # Hash password securely using bcrypt
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt(12)
        password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')

        new_user = User(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            is_verified=False
        )
        db.session.add(new_user)
        db.session.commit()

        # Generate OTP and send via SendGrid
        otp_code = generate_otp(6)
        OTPSession.create_otp(email=email, otp_code=otp_code, valid_minutes=10)
        
        email_sent, error_msg = send_otp_email(email, otp_code)
        
        return True, "User registered successfully. Please verify your email with the OTP sent.", {
            "user": new_user.to_dict(),
            "otp_sent": email_sent,
            "email": email
        }

    @staticmethod
    def login_user(email, password):
        """Authenticates user credentials and sends OTP code for 2FA verification"""
        user = User.query.filter_by(email=email).first()
        if not user:
            return False, "Invalid email or password", None

        # Verify password hash
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return False, "Invalid email or password", None

        # Generate new OTP code for verification session
        otp_code = generate_otp(6)
        OTPSession.create_otp(email=email, otp_code=otp_code, valid_minutes=10)
        
        email_sent, _ = send_otp_email(email, otp_code)

        return True, "Credentials verified. Please enter the OTP sent to your email.", {
            "email": email,
            "otp_sent": email_sent,
            "requires_otp": True
        }

    @staticmethod
    def verify_otp(email, otp_code):
        """Verifies OTP code and issues JWT access token"""
        otp_session = OTPSession.query.filter_by(
            email=email,
            otp_code=otp_code,
            is_used=False
        ).order_by(OTPSession.created_at.desc()).first()

        if not otp_session:
            return False, "Invalid or expired OTP code", None

        if datetime.utcnow() > otp_session.expires_at:
            return False, "OTP code has expired. Please request a new one.", None

        # Mark OTP session as used
        otp_session.is_used = True
        
        user = User.query.filter_by(email=email).first()
        if user:
            user.is_verified = True

        db.session.commit()

        # Issue JWT Access Token
        access_token = create_access_token(identity=user.id if user else email)

        return True, "OTP verified successfully", {
            "access_token": access_token,
            "user": user.to_dict() if user else {"email": email}
        }

    @staticmethod
    def resend_otp(email):
        """Resends a fresh OTP code to user's email"""
        otp_code = generate_otp(6)
        OTPSession.create_otp(email=email, otp_code=otp_code, valid_minutes=10)
        email_sent, error = send_otp_email(email, otp_code)
        
        if email_sent:
            return True, "New OTP code sent successfully", {"email": email}
        else:
            return False, f"Failed to send OTP email: {error}", None

    @staticmethod
    def get_user_profile(user_id):
        """Fetches profile details of current authenticated user"""
        user = User.query.get(user_id)
        if not user:
            return False, "User not found", None
        return True, "User profile retrieved", user.to_dict()
