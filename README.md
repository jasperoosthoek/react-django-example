### Installation

Copy .envs and start using Docker Compose:
```
cp .envs/.react.example .envs/.react
cp .envs/.postgres.example .envs/.postgres
cp .envs/.django.example .envs/.django
sudo docker-compose up -d
```

Enter container
```
docker exec -it backend /entrypoint bash
```

Create superuser who is the referee who will manage the game. In real life this would not be a superuser but for this presentation it suffices. Also, every user will be able to manage all games and all teams which is not a real life situation
```
python manage.py createsuperuser
```

No login to the Table Tennis: localhost:3000. Here you can create Players, Teams and Games. Most of the restrictions of maximum amount of players, no players in opposing teams, are handled here.

Games can be created either one at a time or using a Match maker. Games made by the Match maker count as unplayed and first need to be scored before they impact the statistics.

The referee can click on the link on each team and get a public link, for instance localhost:8000/games/teams/12/

The results can viewed on localhost:8000/games/ranking/ 