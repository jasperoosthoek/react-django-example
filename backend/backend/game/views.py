from django.urls import reverse
from django.views.generic import DetailView
from django.views.generic.base import TemplateView

from .models import Player, Team, Game 

class TeamDetailView(DetailView):
    model = Team

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        games = [
            dict(
                game=game,
                points=game.points_by(self.object),
                score=game.score_1 if game.team_1 == self.object else game.score_2,
                opponent=game.team_1 if game.team_1 != self.object else game.team_2,
                opponent_score=game.score_1 if game.team_2 == self.object else game.score_2,
                close_call=
                    (game.team_1 == self.object and game.score_1 == game.score_2 + 1)
                    or (game.team_2 == self.object and game.score_2 == game.score_1 + 1),
            )
            for game in
                Game.objects.played_by(self.object)
        ]

        if games:
            context['points'] = sum([game['points'] for game in games])
            context['points_per_game'] = context['points'] / len(games)
            context['percentage_won'] = 100 * sum([1 if game['points'] == 2 else 0 for game in games]) / len(games)
            context['percentage_lost'] = 100 * sum([1 if game['points'] == 0 else 0 for game in games]) / len(games)
            context['percentage_draw'] = 100 * sum([1 if game['points'] == 1 else 0 for game in games]) / len(games)
            context['close_calls'] = sum([1 if game['close_call'] else 0 for game in games])
        context['games'] = games

        return context

class RankingView(TemplateView):
    template_name = 'game/ranking.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # In a real life situation, games will belong to users
        games = Game.objects.filter(score_1__isnull=False, score_2__isnull=False)

        # Initialize dict with all teams that have zero points
        teams_points = {t: 0 for t in Team.objects.all()}
        # Reuse empty array for the number of games played
        teams_games_count = {t: 0 for t in Team.objects.all()}

        for g in games:
            # Award 2 points for each game
            if g.score_1 > g.score_2:
                teams_points[g.team_1] += 2
            elif g.score_1 < g.score_2:
                teams_points[g.team_2] += 2
            else:
                teams_points[g.team_1] += 1
                teams_points[g.team_2] += 1

            teams_games_count[g.team_1] += 1
            teams_games_count[g.team_2] += 1

        # Sort by the amount of points
        # Source: https://stackoverflow.com/questions/613183/how-do-i-sort-a-dictionary-by-value
        # https://stackoverflow.com/questions/4233476/sort-a-list-by-multiple-attributes/4233482
        teams_sorted = []
        # Get the unique amount of combinations between number of points and games count
        points_games_count = set()
        rank = 0
        for t, dummy in \
                sorted(
                    teams_points.items(),
                    # Sort by the highest amount of points, when equal rank smaller amount of games higher
                    key=lambda item: (-item[1], teams_games_count[item[0]])
                ):

            prev_rank = rank

            # Save a tuple of number of points and number of games played. Only when both tuples are equal two
            # teams will rank equally.
            points_games_count.add(
                (teams_points[t], teams_games_count[t])
            )
            # Therefore the length of a set containing these tuples will suffice to give the rank of a team
            rank = len(points_games_count)

            if rank != prev_rank:
                teams_sorted.append(dict(
                    rank=rank,
                    teams=[t],
                    points=teams_points[t],
                    games_count=teams_games_count[t],
                ))
            else:
                # These teams score equally, append to previous dict
                teams_sorted[-1]['teams'].append(t)

        context['teams_sorted']  = teams_sorted


        return context

team_detail_view = TeamDetailView.as_view()
ranking_view = RankingView.as_view()