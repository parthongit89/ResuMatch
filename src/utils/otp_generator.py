import random
import string

def generate_otp(length=6):
    """Generates a random 6-digit numeric OTP code"""
    return ''.join(random.choices(string.digits, k=length))
