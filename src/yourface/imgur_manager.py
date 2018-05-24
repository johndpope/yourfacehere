import logging
from imgurpython import ImgurClient
from django.conf import settings

logger = logging.getLogger('django')

client = ImgurClient(client_id=settings.IMGUR_CLIENT_ID, client_secret=settings.IMGUR_CLIENT_SECRET, mashape_key=settings.MASHAPE_KEY)

def upload_url_to_imgur(url: str):
    try:
        upload_resp = client.upload_from_url(url)
        logger.info("Imgur response")
        logger.info(upload_resp)
    except:
        upload_resp = false
        logger.error("Failed response from imgur")
    return upload_resp
