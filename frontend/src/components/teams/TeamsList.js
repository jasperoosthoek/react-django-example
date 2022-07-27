import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Card, Container, Row, Badge } from 'react-bootstrap';
import _ from 'lodash';

import { mapToProps, actions } from '../../redux/factory';

import LoadingIndicator from '../shared/LoadingIndicator';
import CreateEditModal from '../shared/CreateEditModal';
import { CreateButton, DeleteConfirmButton } from '../shared/IconButtons';
import PlayersFormField from '../players/PlayersFormField';
import TeamPlayers from './TeamPlayers';

class TeamsList extends Component {
  state = {
    showNewModal: false

  }

  render() {
    const { getTeamsIsLoading,
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
      <Container fluid className="App py-2 overflow-hidden">
        <Row className="card-example d-flex flex-row overflow-auto">
          {Object.values(teamsList).map((team, key) =>
            <Card style={{ minWidth: '25rem', margin: '10px' }} key={key}>
              <Card.Body
                onClick={() => this.setState({ teamInEditModal: team })}
              >
                {team.name ? team.name : `#${team.id}`}

                <DeleteConfirmButton
                  modalTitle="Delete team"
                  onDelete={() => deleteTeam(team)}
                  loading={deleteTeamIsLoading}
                  className="float-end"
                />
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/game/team/${team.id}/`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  role="button"
                  className="float-end btn btn-light btn-sm"
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
      
      <CreateEditModal
        show={this.state.showNewModal}
        modalTitle="New team"
        loading={createTeamIsLoading}
        onHide={() => this.setState({ showNewModal: false })}
        initialState={{ name: '', players: [] }}
        formFields={formFields}
        validate={validateTeam}

        onSave={newTeam => {
          this.props.createTeam(
            newTeam,
            { callback: () => this.setState({ showNewModal: false }) }
          );
        }}
      />

      {this.state.teamInEditModal &&
        <CreateEditModal
          show={!!this.state.teamInEditModal}
          modalTitle="Modify team"
          loading={updateTeamIsLoading}
          onHide={() => this.setState({ teamInEditModal: null })}
          initialState={this.state.teamInEditModal}
          formFields={formFields}
          validate={validateTeam}

          onSave={team => this.props.updateTeam(
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