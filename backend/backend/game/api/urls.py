from django.conf import settings
from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter

from .views import PlayerViewSet, TeamViewSet, GameViewSet
from config.api_router import router

router.register('players', PlayerViewSet, basename='player')
router.register('teams', TeamViewSet, basename='team')
router.register('games', GameViewSet, basename='game')

urlpatterns = router.urls