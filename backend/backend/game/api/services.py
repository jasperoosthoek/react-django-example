from datetime import datetime
from service_objects.services import Service
from django.utils.timezone import make_aware
from rest_framework.exceptions import APIException
from django.forms import Form, DateField, IntegerField, ValidationError
from django.contrib.postgres.forms import SimpleArrayField

from backend.game.models import Game, Team, Player
from .forms import MatchMakerForm


class MatchMakerService(Service):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Reuse form fields from MatchMakerForm
        self.fields = MatchMakerForm().fields

    def process(self):
        teams = self.cleaned_data['teams']
        # Get queryset of the games played by each team
        team_games = {t: Game.objects.played_by(t) for t in teams}
        team_players = {t: Player.objects.filter(team=t) for t in teams}
        # Get the number of games, use count instead of len to avoid unnecessary db queries
        team_games_count = {t: team_games[t].count() for t in teams}
        team_points = {t: sum([g.points_by(t) for g in team_games[t]]) for t in teams}

        # Now get the average points per game for each team, exclude teams that played zero games
        team_average_points = {t: team_points[t] / team_games_count[t] for t in teams if team_games_count[t] > 0}

        if len(team_average_points) == 0:
            team_average_points = {t: 1 for t in team}
        elif len(team_average_points) != len(teams):
            # Although there are always 2 point given when 2 teams play a single game, the average number of points
            # per game is 1. However, it calculated per team who do not need to have played an equal amount of games
            average_points = sum(team_average_points.values()) / len(team_average_points)

            # Teams that have played zero games will get the average points per game of all other teams
            for t in teams:
                if t in [t for t in teams if team_games_count[t] == 0]:
                    team_average_points[t] = average_points

        # For sake of simplicity the following strategy is chosen:
        # Each team will get an absolute difference 

        team_other_teams = {}
        new_games = []
        for t in teams:
            average_points = team_average_points[t]
            # Calculate the absolute value of the difference between the average points of this team and all
            # other teams that do not contain any players in this team
            players_set = set(team_players[t])
            team_opponent_difference = {
                abs(team_average_points[o] - average_points): o 
                for o in teams
                if len(set(team_players[o]).intersection(players_set)) == 0
            }
            if len(team_opponent_difference) == 0:
                # No teams found with players not in this team
                continue

            # Get the team with the smallest difference which will be the opponent
            opponent = team_opponent_difference[sorted(team_opponent_difference)[0]]
            new_games.append(Game.objects.create(
                date=self.cleaned_data['date'],
                team_1=t,
                team_2=opponent,
            ))
        return new_games


        