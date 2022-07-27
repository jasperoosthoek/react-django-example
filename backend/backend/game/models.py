import pytz
from datetime import datetime
from django.utils.timezone import now

from django.db.models import Model, Manager, CharField, ForeignKey, DateField, DateTimeField, IntegerField, ManyToManyField, BooleanField, CASCADE
from django.contrib.postgres.fields import ArrayField

from backend.users.models import User

class Player(Model):
    created_at = DateTimeField(default=now)
    name = CharField(max_length=255)


class Team(Model):
    created_at = DateTimeField(default=now)
    name = CharField(max_length=255, default='', blank=True)
    players = ManyToManyField(Player)

    def __str__(self):
        return self.name if self.name else f'Team #{self.pk}'

class TeamManager(Manager):
    """
    Return the games a team has played. Note that when the score is None the game still has to be played
    """
    def played_by(self, team):
        qs = self.get_queryset()
        return qs.filter(team_1=team, score_1__isnull=False, score_2__isnull=False) \
            | qs.filter(team_2=team, score_1__isnull=False, score_2__isnull=False)

class Game(Model):
    created_at = DateTimeField(default=now)
    date = DateField()

    team_1 = ForeignKey(Team, related_name='game_team_1', on_delete=CASCADE)
    score_1 = IntegerField(null=True, blank=True)
    team_2 = ForeignKey(Team, related_name='game_team_2', on_delete=CASCADE)
    score_2 = IntegerField(null=True, blank=True)

    objects = TeamManager()

    """
    Calculate points for a particular team or return None if the team didn't play this game
    """
    def points_by(self, team):
        if self.team_1 != team and self.team_2 != team:
            return None
        elif self.score_1 == self.score_2:
            return 1
        elif self.score_1 > self.score_2 and self.team_1 == team:
            return 2
        elif self.score_2 > self.score_1 and self.team_2 == team:
            return 2
        else:
            return 0


