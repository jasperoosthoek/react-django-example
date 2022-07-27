import axios from '../utils/Axios';
import { toastOnError } from '../utils/Utils';
import reduxCrudFactory from '../redux/reduxCrudFactory';

const factory = reduxCrudFactory({
  axios,
  onError: toastOnError,
  actions: {
    getList: true,
    create: true,
    update: true,
    delete: true,
  },
  config: {
    games: {
      route: '/api/game/games/',
      includeActions: {
        matchMaker: {
          route: `/api/game/games/match_maker/`,
          method: 'post',
          onResponse: (games, { setGame }) => games.map(game => setGame(game)),
        },
      },
    },
    players: {
      route: '/api/game/players/',
    },
    points: {
      route: '/api/game/games/points/',
      id: 'points',
      actions: {
        getList: true,
      },
    },
    teams: {
      route: '/api/game/teams/',
    },
  },
});

export default factory;

export const actions = factory.actions;
export const mapToProps = factory.mapToProps;
export const use = factory.hooks;
