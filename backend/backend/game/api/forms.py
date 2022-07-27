from django.forms import Form, DateField, ModelChoiceField, IntegerField
from django.contrib.postgres.forms import SimpleArrayField

from backend.game.models import Team

class MatchMakerForm(Form):
    date = DateField()
    teams = SimpleArrayField(ModelChoiceField(queryset=Team.objects.all()))