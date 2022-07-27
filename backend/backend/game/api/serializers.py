
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ValidationError
from rest_framework.validators import UniqueValidator

from backend.game.models import Game, Team, Player

class PlayerSerializer(ModelSerializer):
    class Meta:
        model = Player
        exclude = 'created_at',

class TeamSerializer(ModelSerializer):
    players = PrimaryKeyRelatedField(
        queryset=Player.objects.all(),
        many=True,
    )
    class Meta:
        model = Team
        exclude = 'created_at',

class GameSerializer(ModelSerializer):
    class Meta:
        model = Game
        exclude = 'created_at',