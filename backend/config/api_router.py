from django.conf import settings
from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter

from backend.users.api.views import UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register('users', UserViewSet)


app_name = 'api'
urlpatterns = [
    
    # Use Djoser for all rest api based authentication
    url('', include('djoser.urls')),
    url('', include('djoser.urls.authtoken')),

    path('game/', include('backend.game.api.urls')),
] + router.urls
