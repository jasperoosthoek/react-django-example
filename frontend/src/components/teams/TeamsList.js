import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Card, Container, Row, Badge } from 'react-bootstrap';
import _ from 'lodash';

import { mapToProps, actions } from '../../redux/factory';

import {
  LoadingIndicator,
  CreateEditModal as CreateModal,
  CreateEditModal as EditModal,
  CreateButton,
  DeleteConfirmButton,
} from '../shared/ReactToolbox';
import PlayersFormField from '../players/PlayersFormField';
import TeamPlayers from './TeamPlayers';

// Demonstration of a class based component. Because classes cannot use hooks and use connect instead,
// Therefore, the loading state cannot be attached to the functions, for instance:
// createTeam.isLoading will be undefined, and createTeamIsLoading needs to be taken from the props.
// Using redux connect(), the component will be flooded with props. This of course is similar to function 
// based components when connect() is used instead of hooks.
class TeamsList extends Component {
  state = {
    showNewModal: false,
    teamInEditModal: null,
  }

  render() {
    const {
      getTeamsIsLoading,
      teamsList,
      createTeam,
      createTeamIsLoading,
      updateTeam,
      updateTeamIsLoading,
      deleteTeam,
      deleteTeamIsLoading,
      getPlayersIsLoading,
      playersList,
    } = this.props;
    
    if (getTeamsIsLoading || !teamsList || getPlayersIsLoading || !playersList) return <LoadingIndicator />;
    
    const formFields = {
      name: { label: 'Name' },
      players: { label: 'Players', component: PlayersFormField },
    };
    const validateTeam = ({ players, id }) => {
      if (players.length === 0) {
          return false;
      }  
      const playersSet = new Set(players)
      if (
        players.length > 0
        && Object.values(teamsList).find(
          otherTeam =>
            (!id || id !== otherTeam.id)
            && _.isEqual(new Set(otherTeam.players), playersSet)
        )
      ) {
        return { players: 'Team already exists' };
      };
      return true;
    };

    return <>
      <Container fluid className='App py-2 overflow-hidden'>
        <Row className='card-example d-flex flex-row overflow-auto'>
          {Object.values(teamsList).map((team, key) =>
            <Card style={{ minWidth: '25rem', margin: '10px' }} key={key}>
              <Card.Body
                onClick={() => this.setState({ teamInEditModal: team })}
              >
                {team.name ? team.name : `#${team.id}`}

                <DeleteConfirmButton
                  modalTitle='Delete team'
                  onDelete={() => deleteTeam(team)}
                  loading={deleteTeamIsLoading}
                  className='float-end'
                />
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/game/team/${team.id}/`}
                  target='_blank'
                  rel='noreferrer'
                  onClick={e => e.stopPropagation()}
                  role='button'
                  className='float-end btn btn-light btn-sm'
                >
                  Results
                </a>
                <br />
                <TeamPlayers team={team} />
              </Card.Body>
            </Card>
          )}
          <Card style={{ margin: '10px' }}>
            <Card.Body>
              <CreateButton onClick={() => this.setState({ showNewModal: true })} />
            </Card.Body>
          </Card>
        </Row>
      </Container>
      
      <CreateModal
        show={this.state.showNewModal}
        modalTitle='New team'
        loading={createTeamIsLoading}
        onHide={() => this.setState({ showNewModal: false })}
        initialState={{ name: '', players: [] }}
        formFields={formFields}
        validate={validateTeam}

        onSave={newTeam => {
          createTeam(
            newTeam,
            { callback: () => this.setState({ showNewModal: false }) }
          );
        }}
      />

      {this.state.teamInEditModal &&
        <EditModal
          show={!!this.state.teamInEditModal}
          modalTitle='Modify team'
          loading={updateTeamIsLoading}
          onHide={() => this.setState({ teamInEditModal: null })}
          initialState={this.state.teamInEditModal}
          formFields={formFields}
          validate={validateTeam}

          onSave={team => updateTeam(
            team,
            { callback: () => this.setState({ teamInEditModal: null }) }
          )}
      />}
    </>;
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...mapToProps.teams(state),
  ...mapToProps.players(state),
});

export default connect(mapStateToProps, {
  ...actions.teams,
})(TeamsList);