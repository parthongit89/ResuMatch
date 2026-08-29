import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base Configuration Class"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'resumatch_default_secret_key_2026')

    # Database Settings (Neon PostgreSQL / Local SQLite)
    _db_url = os.getenv('DATABASE_URL', 'sqlite:///resumatch.db')
    if _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 280
    }

    # JWT Authentication Settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'resumatch_jwt_secret_2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 24)))

    # SendGrid OTP Email Service Settings
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
    SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'sonavaneparthgit@gmail.com')

    # Firebase Google OAuth Settings
    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID', '')
    FIREBASE_API_KEY = os.getenv('FIREBASE_API_KEY', '')

    # CORS Settings
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    DEBUG = False

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
