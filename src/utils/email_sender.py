import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_otp_email(recipient_email, otp_code):
    """
    Sends an OTP verification email using the SendGrid API.
    Returns (True, None) on success, or (False, error_message) on failure.
    """
    api_key = os.getenv('SENDGRID_API_KEY')
    sender_email = os.getenv('SENDER_EMAIL', 'sonavaneparthgit@gmail.com')

    if not api_key:
        print("[WARNING] SENDGRID_API_KEY missing in environment variables.")
        return False, "SendGrid API Key missing in server environment"

    html_content = f"""
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; background: #0a0d14; color: #f8fafc; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <h2 style="color: #818cf8; text-align: center; margin-bottom: 20px;">Resu<span style="color: #ec4899;">Match</span> Verification</h2>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.5;">Hello!</p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.5;">Your one-time OTP verification code for ResuMatch is:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 12px 28px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.35); display: inline-block;">{otp_code}</span>
        </div>
        <p style="font-size: 13px; color: #64748b; text-align: center;">This code will expire in 10 minutes. Do not share this OTP with anyone.</p>
        <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 25px 0;">
        <p style="font-size: 12px; color: #475569; text-align: center;">Made with ❤️ by Parth & Harshal | ResuMatch Team</p>
    </div>
    """

    message = Mail(
        from_email=sender_email,
        to_emails=recipient_email,
        subject='ResuMatch - Your OTP Verification Code',
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        if response.status_code in [200, 201, 202]:
            print(f"[SendGrid SUCCESS] OTP email sent to {recipient_email} (Status: {response.status_code})")
            return True, None
        else:
            return False, f"SendGrid returned status code {response.status_code}"
    except Exception as e:
        print(f"[SendGrid ERROR] Failed to send email to {recipient_email}: {str(e)}")
        return False, str(e)
