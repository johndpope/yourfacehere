from django.urls import path

from . import views

urlpatterns = [
    path('init', views.init, name='session_init'),
    path('cancel_session', views.cancel_session, name='session_cancel'),
    path('user_upload', views.user_upload, name='user_upload'),
    path('splash', views.get_available_splash, name='get_splash'),
    path('merge', views.final_merge, name='final_merge'),
]
