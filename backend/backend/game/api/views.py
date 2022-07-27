from datetime import datetime
from django.shortcuts import render
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils.timezone import make_aware
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.exceptions import APIException
from rest_framework.viewsets import ModelViewSet 

from backend.game.models import Game, Team, Player
from .serializers import PlayerSerializer, TeamSerializer, GameSerializer
from .forms import MatchMakerForm
from .services import MatchMakerService

'''
    Reusable class with custom filter function

    Note that if the null parameter is set, its value turns a query parameter into a None value
'''
class FilterQuerysetMixin():
    def _filter_queryset(self, field_names, user=None, queryset=None, null=None):
        ''' A second .all() around the queryset is required to avoid the following error:
            "RuntimeError: Do not evaluate the `.queryset` attribute directly, as the result
            will be cached and reused between requests. Use `.all()` or call `.get_queryset()` instead."
        '''
        queryset = queryset or self.queryset.all()
        if user:
            queryset = queryset.filter(user=user)
        for field_name in field_names:
            value = self.request.query_params.get(field_name, None)
            if value is not None:
                if null and value == null:
                    value = None
                queryset = queryset.filter(**{field_name: value})
        return queryset

class PlayerViewSet(ModelViewSet, FilterQuerysetMixin):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()

class TeamViewSet(ModelViewSet, FilterQuerysetMixin):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()

class GameViewSet(ModelViewSet, FilterQuerysetMixin):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    @action(detail=False, methods=['post'])
    def match_maker(self, request, *args, **kwargs):
        if not MatchMakerForm(request.data).is_valid():
            raise APIException('Invalid request data')

        games = MatchMakerService.execute(request.data)
        return Response(GameSerializer(games, many=True).data)
