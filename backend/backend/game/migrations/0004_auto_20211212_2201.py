# Generated by Django 3.1.8 on 2021-12-12 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_auto_20211127_0017'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='score_1',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='score_2',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
