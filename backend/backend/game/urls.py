from django.conf import settings
from django.conf.urls import url
from django.urls import include, path

from backend.game.views import (
    team_detail_view,
    ranking_view,
)

def trigger_error(request):
    division_by_zero = 1 / 0

app_name = 'backend'
# app_name = 'game'
urlpatterns = [
    path('sentry-debug/', trigger_error),
    path('team/<pk>/', view=team_detail_view, name='team_detail'),
    path('ranking/', view=ranking_view, name='ranking'),
]
