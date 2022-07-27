
import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';

import { mapToProps, actions } from '../../redux/factory';

const TeamPlayers = ({ team, playersList, component, separator }) => team.players.map((playerId, key) => {
  const Component = component || Badge;
  return (
    <span key={key}>
      <Component variant="primary" style={{ cursor: 'default' }}>
        {playersList[playerId]
          ? playersList[playerId].name
          : <i>Not found</i>
        }
      </Component>
    {key < team.players.length - 1 && (separator || <>&nbsp;</>)}
  </span>)
});


export default connect(mapToProps.players)(TeamPlayers);