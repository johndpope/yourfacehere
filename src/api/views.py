#from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import logging
import boto3
from yourface import s3_manager, splash_manager, imgur_manager
import urllib
import json
from PIL import Image
from django.views.decorators.csrf import ensure_csrf_cookie

logger = logging.getLogger("django")

CONST_SESSION_UPLOADED_DATA_KEY = 'uploaded_face_data'
CONST_SESSION_MERGED_DATA_KEY = 'merged_face_data'

@ensure_csrf_cookie
def init(request):
    request.session['init'] = 1
    if not request.session.get(CONST_SESSION_UPLOADED_DATA_KEY, False):
        return JsonResponse({})
    else:
        uploaded = request.session.get(CONST_SESSION_UPLOADED_DATA_KEY)
        merged = request.session.get(CONST_SESSION_MERGED_DATA_KEY)
        return JsonResponse({'original': uploaded['original'], 'merged': merged, 'faces': uploaded['faces']})

def cancel_session(request):
    request.session.flush()
    return HttpResponse()

def user_upload(request):
    if request.method != 'POST':
        return HttpResponse(status=404)

    photo = request.FILES['photo']
    faces_data = s3_manager.upload_and_detect_faces(photo)    
    request.session[CONST_SESSION_UPLOADED_DATA_KEY] = faces_data
    return JsonResponse(faces_data, status=200,content_type='application/json')

def get_available_splash(request):
    if not request.session.get(CONST_SESSION_UPLOADED_DATA_KEY, False):
        return HttpResponse(status=401)

    #@TODO dynamic num of faces
    num_faces = request.GET.get('max_faces',1)
    splash_items = splash_manager.get_available_splash(int(num_faces))
    ret = []
    for splash_item in splash_items:
        ret.append(splash_item.todict())

    return JsonResponse({'splash': ret})

def final_merge(request):
    if not request.session.get(CONST_SESSION_UPLOADED_DATA_KEY, False):
        return HttpResponse(status=401)

    #do the thing with the thing
    faces = request.session.get(CONST_SESSION_UPLOADED_DATA_KEY)
    json_data = json.loads(request.body)
    #@todo validate post
    splash_image = splash_manager.get_splash_image(num_faces=json_data['num_faces'], key=json_data['key'])
    
    for face in faces['faces']:
        # @TODO this will get changed
        for face_map in json_data['selected_face_map']:
            if face_map['face_url'] == face['url']:
                logger.info("Found the face")
                #ugh - getting from URL? can we get this from memory or something to save time?
                face_image = Image.open(urllib.request.urlopen(face['url']))
                splash_image.insert_cropped_face( face_image, splash_image.get_empty_face_index_by_label(face_map['empty_face_label']) )

    final_image = splash_image.render()
    ret_data = s3_manager.upload_merged_splash(final_image)
    imgur_resp = imgur_manager.upload_url_to_imgur(ret_data['url'])
    if 'link' in imgur_resp:
        ret_data['s3_url'] = ret_data['url']
        ret_data['url'] = imgur_resp['link']

    request.session[CONST_SESSION_MERGED_DATA_KEY] = ret_data

    return JsonResponse(ret_data)


    
