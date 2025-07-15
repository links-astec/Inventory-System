from .models import Notification
import requests
import os


def notify_user(user, message):
    """
    Sends notification both in-web (database) and via SMS.
    """
    # In-web notification
    Notification.objects.create(user=user, message=message)

    # SMS notification
    if hasattr(user, 'userprofile') and user.userprofile.phone_number:
        send_sms(user.userprofile.phone_number, message)


def send_sms(phone_number, message):
    """
    Sends an SMS via your configured SMS API provider.
    This example uses a generic HTTP API call.
    """

    SMS_API_URL = os.environ.get('SMS_API_URL')
    SMS_API_KEY = os.environ.get('SMS_API_KEY')

    if not SMS_API_URL or not SMS_API_KEY:
        print("SMS sending skipped: API not configured.")
        return

    payload = {
        'to': phone_number,
        'message': message,
        'api_key': SMS_API_KEY,
    }

    try:
        response = requests.post(SMS_API_URL, data=payload)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to send SMS: {e}")
