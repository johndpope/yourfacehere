from PIL import Image
from io import BytesIO
from django.conf import settings
import boto3 
import base64
import logging 
import yourface.diagonal_crop as diagonal_crop
import math
import urllib

logger = logging.getLogger("django")

class SplashImage:

    def __init__(self, file_path=None,url_path=None, img_bytes=None):
        if file_path is not None:
            self.img = Image.open(file_path)
        elif url_path is not None:
            self.img = Image.open(urllib.request.urlopen(url_path))
        elif img_bytes is not None:
            self.img = Image.open(BytesIO(img_bytes))

        self.empty_faces = []
        self.empty_face_layers = []


    def add_empty_face_bounding_box(self, **kwargs):
        face = SplashImageFace(**kwargs)
        self.empty_faces.append(face)

    def insert_cropped_face(self, face_image:Image, empty_face_idx=0):
        if len(self.empty_faces) == 0 or empty_face_idx > len(self.empty_faces):
            raise "No faces or face index is out of bounds"

        if self.img is None:
            raise "Main splash image is not set"

        face_bounds = self.empty_faces[empty_face_idx]
        face_box = (face_bounds.left, face_bounds.top, face_bounds.left + face_bounds.width, face_bounds.top + face_bounds.height)
        
        logger.info("Face Bounds: {0}  Image Size: {1} Face Image Size: {2}".format(str(face_bounds), self.img.size, face_image.size))
        cropped_face_image = Image.new("RGBA", self.img.size)

        #Would like to use thumbnail, but for some reason throws an error for images not matching in pillow when pasting below
        #face_image.thumbnail((face_bounds.width, face_bounds.height), Image.ANTIALIAS)
        face_image = face_image.resize((face_bounds.width, face_bounds.height), Image.ANTIALIAS)

        if face_bounds.angle > 0:
            logger.info("Angling")
            face_image = face_image.rotate(face_bounds.angle)
            logger.info("New face image size: {0}".format(face_image.size))

        cropped_face_image.paste(face_image, face_box)
        self.empty_face_layers.append(cropped_face_image)

    def render(self):
        final = Image.new("RGBA", self.img.size)        
        for face_layer in self.empty_face_layers:
            final = Image.alpha_composite(final, face_layer)

        final = Image.alpha_composite(final, self.img)
        return final

    def get_empty_face_index_by_label(self, label):
        idx = 0
        for empty_face in self.empty_faces:
            logger.info("Index %s", str(idx))
            if empty_face.label == label:
                return idx
            idx +=1

        return 0

class SplashImageFace:
    def __init__(self, width, height, top, left, angle=0,label=''):
        self.width = width
        self.height = height
        self.top = top
        self.left = left
        self.angle = angle
        self.label= label

    def __str__(self):
        return_str = "(Width: {0}, Height: {1}, Top: {2} Left: {3}, Angle: {4}, Label: {5})".format(self.width, self.height, self.top, self.left, self.angle, self.label)
        return return_str


"""
Needs to be refactored for multiple faces
"""
class ImageManipulator:
    def __init__(self):
        self.splash_image = None
        self.user_image = None
        self.rekognized_data = None

    def set_splash_image(self, splash: SplashImage):
        self.splash_image = splash
        return self

    def set_user_image(self, filedata):
        self.user_image = self.__get_image_from_filedata(filedata)
        return self

    def set_user_image_from_path(self, file_path):
        self.user_image = self.__get_image_from_path(file_path)
        return self

    #Note that this call sets automatically performs rekognition on the item from within the bucket, setting the rekognition_data global
    def set_user_image_from_s3(self, filename):
        rekognize_client = boto3.client('rekognition', settings.AWS_REKOGNITION_REGION)
        self.user_image = Image.open(urllib.request.urlopen(settings.USER_UPLOAD_PUBLIC_HOST + filename))
        face_detection = rekognize_client.detect_faces(
            Image={
                'S3Object': {
                    'Bucket': settings.USER_UPLOAD_BUCKET,
                    'Name': filename
                }
            },
            Attributes=[
                'DEFAULT',
            ]
        )
        self.rekognized_data = face_detection
        logger.info("Rekognized data")
        logger.info(self.rekognized_data)
        return self


    def get_rendered_image(self):
        if self.user_image is None:
            return self.splash_image
        else:
            cropped_face = self.get_cropped_face_straight()
            self.splash_image.insert_cropped_face(cropped_face)
            return self.splash_image.render()

    """
    Gets a single cropped face from the uploaded user image
    """
    def get_cropped_faces(self):
        faces_details = self.__get_all_face_details()
        faces = []
        for face_details in faces_details:            
            cropped_width = int(self.user_image.width * (face_details['BoundingBox']['Width'] or 1))
            cropped_height = int(self.user_image.height * (face_details['BoundingBox']['Height'] or 1))
            base_left = int(self.user_image.width * (face_details['BoundingBox']['Left'] or 1))
            base_top =  int(self.user_image.height * (face_details['BoundingBox']['Top'] or 1))

            logger.info("Base top: %d", base_top)
            if base_top < 0:
                base_top = 0

            rads = int(face_details['Pose']['Roll'] / 180)
            angle = 0
            logger.info(face_details['Pose'])
            if rads != 0:
                angle = math.pi / rads

            face = diagonal_crop.crop(self.user_image, (base_left, base_top), angle, cropped_height, cropped_width)

            if 'OrientationCorrection' in self.rekognized_data:                
                if self.rekognized_data['OrientationCorrection'] == 'ROTATE_90':
                    face = face.rotate(270)
                elif self.rekognized_data['OrientationCorrection'] == 'ROTATE_180':
                    face = face.rotate(180)
                elif self.rekognized_data['OrientationCorrection'] == 'ROTATE_270':
                    face = face.rotate(90)

            faces.append(face)
        
        return faces

    """
    Gets a single cropped face from the uploaded user image
    """
    def get_first_cropped_face_straight(self):
        face_details = self.__get_first_face_details()
        cropped_width = int(self.user_image.width * (face_details['BoundingBox']['Width'] or 1))
        cropped_height = int(self.user_image.height * (face_details['BoundingBox']['Height'] or 1))
        base_left = int(self.user_image.width * (face_details['BoundingBox']['Left'] or 1))
        base_top =  int(self.user_image.height * (face_details['BoundingBox']['Top'] or 1))
        rads = (int(face_details['Pose']['Roll']) / 180)
        angle = 0
        if rads != 0:
            angle = math.pi / rads
        
        return diagonal_crop.crop(self.user_image, (base_left, base_top), angle, cropped_height, cropped_width)

    def __get_all_face_details(self):
        if self.user_image is None:
            raise "No user image set"
        elif self.rekognized_data is None:
            self.rekognized_data = self.__rekognize_image()
            
        return self.rekognized_data['FaceDetails'] or None

    def __get_first_face_details(self):
        if self.user_image is None:
            raise "No user image set"
        elif self.rekognized_data is None:
            self.rekognized_data = self.__rekognize_image()
            
        return self.rekognized_data['FaceDetails'][0] or None

    def __rekognize_image(self):
        rekognize_client = boto3.client('rekognition', settings.AWS_REKOGNITION_REGION)
        buffer = BytesIO()
        self.user_image.save(buffer, format="PNG")
        face_detection = rekognize_client.detect_faces(
            Image={
                'Bytes': buffer.getvalue()
            },
            Attributes=[
                'DEFAULT',
            ]
        )
        logger.info("Face detection")
        logger.info(face_detection)
        return face_detection

    def __get_image_from_path(self, file_path):
        img = Image.open(file_path)
        return img

    def __get_image_from_filedata(self, filedata):        
        img = Image.open(BytesIO(filedata))
        return img
