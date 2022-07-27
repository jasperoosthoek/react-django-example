
import React from 'react';
import { Badge } from 'react-bootstrap';

import { use } from '../../redux/factory';

const TeamPlayers = ({ team, component, separator }) => {
  const { playersList } = use.players();
  return team.players.map(
    (playerId, key) => {
        const Component = component || Badge;
        return (
          <span key={key}>
            <Component variant='primary' style={{ cursor: 'default' }}>
              {playersList[playerId]
                ? playersList[playerId].name
                : <i>Not found</i>
              }
            </Component>
          {key < team.players.length - 1 && (separator || <>&nbsp;</>)}
        </span>)
      }
  );
};

export default TeamPlayers;