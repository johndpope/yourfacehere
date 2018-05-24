from django.conf import settings
import logging
logger = logging.getLogger('django')

class SplashBaseItem:
    def __init__(self, 
                id='',
                key='',
                filename='',
                faceless_filename='',
                label='',
                category_key='',
                num_faces=0,
                empty_faces=[],):
        self.id = id
        self.filename = filename
        self.key = key
        self.label = label
        self.category_key = category_key
        self.num_faces = num_faces
        self.empty_faces = empty_faces
        self.url =  settings.SPLASH_PUBLIC_HOST + self.category_key + '/' + str(self.num_faces) + 'faces/' + self.filename
        self.empty_face_path =  settings.SPLASH_PATH_PREFIX + self.category_key + '/' + str(self.num_faces) + 'faces/' + faceless_filename

    def get_face_dict(self, empty_face):
        return empty_face.todict()

    def todict(self):

        return {
            'id': self.id,
            'key': self.key,
            'label': self.label,
            'category_key': self.category_key,
            'num_faces': self.num_faces,
            'url': self.url,
            'empty_faces': list(map(self.get_face_dict, self.empty_faces))
        }


class SplashImageEmptyFaceItem:
    def __init__(self, width, height, top, left, angle=0,label=''):
        self.width = width
        self.height = height
        self.top = top
        self.left = left
        self.angle = angle
        self.label = label

    def todict(self):
        return {
            'width': self.width,
            'height': self.height,
            'top': self.top,
            'left': self.left,
            'angle': self.angle,
            'label': self.label,
        }
