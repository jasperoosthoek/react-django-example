### Installation

Copy `.envs` and run the project with Docker Compose:

```
$ cp .envs/.react.example .envs/.react
$ cp .envs/.postgres.example .envs/.postgres
$ cp .envs/.django.example .envs/.django
$ sudo docker-compose up -d
```

Enter the container:

```
$ docker exec -it backend /entrypoint bash
```

Create superuser who is the referee managing the game:

```
$ python manage.py createsuperuser
```

Note: In a production environment there will be no superuser, we merely create
it for presentation purposes. In the current setup all users are be able to
manage all games and all teams which is not a real life situation.

Now login to the "Table Tennis" administration panel at the following address
via your browser:

```
localhost:3000.
```

Here you can create "Players", "Teams" and "Games". Most of the restrictions
such as maximum amount of players, no players in opposing teams, are handled
here.

Games can be created either one at a time or using a "Match maker". Games made
by the "Match maker" count as unplayed and first need to be scored before they
impact the statistics.

The referee can click on the link on each team and get a public link such as
`localhost:8000/games/teams/12/`.

The results can viewed on `localhost:8000/games/ranking/`.
