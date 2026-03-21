import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.database import settings


async def send_otp_email(to_email: str, otp: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{otp} is your SneakerAuth verification code"
    msg["From"] = f"SneakerAuth <{settings.GMAIL_USER}>"
    msg["To"] = to_email

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #111; margin-bottom: 8px;">Your verification code</h2>
      <p style="color: #555; margin-bottom: 24px;">Enter this code to sign in to SneakerAuth:</p>
      <div style="background: #f4f4f4; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111;">{otp}</span>
      </div>
      <p style="color: #888; font-size: 13px;">This code expires in 5 minutes. Don't share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
      <p style="color: #aaa; font-size: 12px;">SneakerAuth — AI-powered shoe authentication</p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=settings.GMAIL_USER,
        password=settings.GMAIL_APP_PASSWORD,
    )
