import boto3
from django.conf import settings
from datetime import datetime
import logging
from . import image_manipulator
from io import BytesIO
from PIL import Image

logger = logging.getLogger('django')
s3 = boto3.client('s3')

CONST_PATH_UPLOAD_ORIGINAL = settings.USER_UPLOAD_PATH_PREFIX + 'original/'
CONST_PATH_UPLOAD_FACES = settings.USER_UPLOAD_PATH_PREFIX + 'faces/'
CONST_PATH_UPLOAD_MERGED = settings.USER_UPLOAD_PATH_PREFIX + 'merged/'


def upload_and_detect_faces(file):
    filedata = file.read()

    image = Image.open(BytesIO(filedata))
    data = list(image.getdata())
    image_without_exif = Image.new(image.mode, image.size)
    image_without_exif.putdata(data)

    uploaded_data = __upload_original(__image_to_bytes(image_without_exif).getvalue())
    manipulator = image_manipulator.ImageManipulator()
    manipulator.set_user_image_from_s3(uploaded_data['full_key'])
    cropped_faces = manipulator.get_cropped_faces()
    faces_data = []
    for cropped_face in cropped_faces:
        uploaded_face = __upload_face(cropped_face, uploaded_data)
        faces_data.append(uploaded_face)

    ret_data = {
        'original': uploaded_data,
        'faces': faces_data
    }
    
    return ret_data

def upload_merged_splash(img):
    data = __image_to_bytes(img)
    now = datetime.now()
    day_str = now.strftime('%Y%m%d')
    # TODO Detect format and set extension properly (?)
    file_key = now.strftime('%H%M%S%f') + '.png'
    keyname =  CONST_PATH_UPLOAD_MERGED + day_str + "/" +file_key

    upload_args = {
        'ContentType': 'image/png',
        'ACL':'public-read',
    }    
    upload_resp = s3.upload_fileobj( data , settings.USER_UPLOAD_BUCKET, keyname, ExtraArgs=upload_args)    
    ret_data = {
        'filename': file_key,
        'full_key': keyname,
        'day_str': day_str,
        'url': settings.USER_UPLOAD_PUBLIC_HOST + keyname,
    }
    return ret_data

def get_filedata(path):
    fileio = BytesIO()
    s3.download_fileobj(settings.SPLASH_BUCKET, path, fileio)
    fileio.seek(0)
    return fileio.getvalue()

def __upload_original(filedata):
    now = datetime.now()
    day_str = now.strftime('%Y%m%d')
    # TODO Detect format and set extension properly (?)
    file_key = now.strftime('%H%M%S%f') + '.png'
    keyname =  CONST_PATH_UPLOAD_ORIGINAL + day_str + "/" +file_key

    upload_args = {
        'ContentType': 'image/png',
        'ACL':'public-read',
    }    
    upload_resp = s3.upload_fileobj(BytesIO(filedata), settings.USER_UPLOAD_BUCKET, keyname, ExtraArgs=upload_args)    
    ret_data = {
        'filename': file_key,
        'full_key': keyname,
        'day_str': day_str,
        'url': settings.USER_UPLOAD_PUBLIC_HOST + keyname,
    }
    return ret_data

def __upload_face(face: Image, original_upload_data):
    now = datetime.now()
    file_key = now.strftime('%H%M%S%f') + '.png'
    keyname = CONST_PATH_UPLOAD_FACES + original_upload_data['day_str'] + "/" + file_key

    upload_args = {
        'ContentType': 'image/png',
        'ACL':'public-read',
    }
    face_bytes = __image_to_bytes(face)
    upload_resp = s3.upload_fileobj( face_bytes, settings.USER_UPLOAD_BUCKET, keyname, ExtraArgs=upload_args)
    ret_data = {
        'filename': file_key,
        'full_key': keyname,
        'url': settings.USER_UPLOAD_PUBLIC_HOST + keyname,
    }
    return ret_data

def __image_to_bytes(img: Image):
    in_mem_file = BytesIO()
    img.save(in_mem_file, format='PNG')
    in_mem_file.seek(0)
    return in_mem_file
