from django.core.management.base import BaseCommand, CommandError

from datetime import datetime, timedelta



class Command(BaseCommand):
    help = 'Test'

    def handle(self, *args, **options):
        print ('Hello world')