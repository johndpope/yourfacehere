from importlib import import_module 
from . import image_manipulator, s3_manager
import logging

logger = logging.getLogger("django")


in_memory_splash = {}

def get_available_splash(num_faces: int):
    global in_memory_splash
    if num_faces in in_memory_splash:
        return in_memory_splash[num_faces]

    ret = []
    faces_inc = num_faces
    while faces_inc > 0:
        logger.info("Num Faces here %s", str(faces_inc))
        try:
            available_splash_mod = import_module('yourface.splash.' + str(faces_inc) + 'face')
            splash_method = getattr(available_splash_mod, 'get_splash')
            available_splash = splash_method()
            for splash in available_splash:
                ret.append(splash)
        except:
            logger.error("Unable to import splash with " + str(faces_inc) + " faces")
        
        faces_inc -= 1

    in_memory_splash[num_faces] = ret    
    return in_memory_splash[num_faces]

def get_splash_image(num_faces: int, key: str):
    splash_item = _get_splash_item(num_faces=num_faces, key=key)
    if splash_item is None:
        return None
    splash_image_bytes = s3_manager.get_filedata(splash_item.empty_face_path)
    splash_image = image_manipulator.SplashImage(img_bytes=splash_image_bytes)
    logger.info("Number of empty faces: %s", str(len(splash_item.empty_faces)))
    logger.info("Number of empty faces in obj already: %s", str(len(splash_image.empty_faces)))
    for empty_face in splash_item.empty_faces:
        splash_image.add_empty_face_bounding_box(
            width=empty_face.width,
            height=empty_face.height,
            top=empty_face.top,
            left=empty_face.left,
            angle=empty_face.angle,
            label=empty_face.label,
        )

    return splash_image


def _get_splash_item(num_faces: int, key: str):
    splash_items = get_available_splash(num_faces)
    for splash in splash_items:
        logger.info("Matching: %s - %s", splash.key, key )
        if splash.key == key:
            logger.info("Returning %s", splash.key)
            return splash

    return None



