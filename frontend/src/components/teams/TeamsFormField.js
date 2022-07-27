import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Card, Container, Row, Badge, Form } from 'react-bootstrap';

import { mapToProps, actions } from '../../redux/factory';

class TeamsFormField extends Component {
  state = {
    showNewModal: false

  }

  render() {
    const { teamsList, value: teamIds, onChange } = this.props;
    
    return <div className="form-control-lg">
      {Object.values(teamsList).map((team, key) => {
        const isInTeam = teamIds.find(id => { return id === team.id });

        return <span key={key}>
          <Badge
            variant={isInTeam ? "primary" : "secondary"}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (isInTeam) {
                onChange(teamIds.filter(id => id !== team.id));
              } else {
                onChange([...teamIds, team.id]);
              }
            }}
          >
            {team.name ? team.name : `#${team.id}`}
          </Badge>
          &nbsp;
        </span>
      })}
    </div>;
  }
}


export default connect(mapToProps.teams)(TeamsFormField);