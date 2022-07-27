import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Card, Container, Row, Badge, Form } from 'react-bootstrap';

import { mapToProps, actions } from '../../redux/factory';

class PlayersFormField extends Component {
  state = {
    showNewModal: false

  }

  render() {
    const { playersList, value: playerIds, onChange } = this.props;
    
    return <div className="form-control-lg">
      {Object.values(playersList).map((player, key) => {
        const isInTeam = playerIds.find(id => { return id === player.id });

        return <span key={key}>
          <Badge
            variant={isInTeam ? "primary" : "secondary"}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (isInTeam) {
                onChange(playerIds.filter(id => id !== player.id));
              } else if(playerIds.length < 3) {
                onChange([...playerIds, player.id]);
              }
            }}
          >
            {player.name}
          </Badge>
          &nbsp;
        </span>
      })}
    </div>;
  }
}


export default connect(mapToProps.players)(PlayersFormField);