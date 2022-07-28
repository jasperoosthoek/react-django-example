import React from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import { Container, Card, Badge, Col, Row, Button, Alert } from 'react-bootstrap';

import { use } from '../../redux/factory';

import { 
  LoadingIndicator,
  CreateEditModal as CreateModal,
  CreateEditModal as EditModal,
  DeleteConfirmButton,
  useSetState,
} from '../shared/ReactToolbox';
import TeamPlayers from '../teams/TeamPlayers';
import TeamsDropdown from '../teams/TeamsDropdown';
import TeamsFormField from '../teams/TeamsFormField';

const Game = ({ team, score }) => <>
  <h3><Badge variant='light'>{score}</Badge></h3>
  <br />
  {team.name}
  <br />
  <TeamPlayers team={team} />
</>

const GamesList = () => {
  const [state, setState] = useSetState({
    showNewModal: false,
    showMatchMakerModal: false,
    gameInEditModal: false,
  });

  const { getGamesList, gamesList, createGame, updateGame, deleteGame, matchMaker } = use.games();
  const { teamsList } = use.teams();
  
  if (getGamesList.isLoading || !gamesList || !teamsList) return <LoadingIndicator />;
  
  const formFields = {
    date: { label: 'Date' },
    team_1: {
      label: 'Team 1',
      component: ({ state, ...restProps }) => <TeamsDropdown {...restProps} opponent={state.team_2} />,
    },
    score_1: {
      label: 'Score',
      formProps: { type: 'number' },
    },
    team_2: {
      label: 'Team 2',
      component: ({ state, ...restProps }) => <TeamsDropdown {...restProps} opponent={state.team_1} />,
    },
    score_2: {
      label: 'Score',
      formProps: { type: 'number' },
    },
  };

  return <>
    <div style={{ margin: '10px' }}>
      <Button
        onClick={() => setState({ showNewModal: true })}
      >
        New game
      </Button>
      <Button
        onClick={() => setState({ showMatchMakerModal: true })}
        style={{ marginLeft: '10px' }}
      >
        Match maker
      </Button>
      <a
        href={`${process.env.REACT_APP_BACKEND_URL}/games/ranking/`}
        role='button'
        className='btn btn-primary'
        target='_blank'
        rel='noreferrer'
        style={{ marginLeft: '10px' }}
      >
        Ranking
      </a>
    </div>

    <Container fluid className='App py-2 overflow-hidden'>
      <Row className='card-example d-flex flex-row overflow-auto'>
        {Object.values(gamesList).map((game, key) =>
          <Card style={{ minWidth: '36rem', margin: '10px' }} key={key}>
            <Card.Body
              onClick={() => setState({ gameInEditModal: game })}
            >
              {game.name}

              {game.score_1 === null && game.score_2 === null &&
                <Alert variant='success'>Play game!</Alert>
              }
              <Row>
                <Col>
                  {teamsList[game.team_1] &&
                    <Game team={teamsList[game.team_1]} score={game.score_1} />}
                </Col>
                <Col>
                  {teamsList[game.team_2] &&
                    <Game team={teamsList[game.team_2]} score={game.score_2} />}
                </Col>
              </Row>
              <DeleteConfirmButton
                modalTitle='Delete game'
                onDelete={() => deleteGame(game)}
                loading={deleteGame.isLoading}
                className='float-end'
              />

            </Card.Body>
          </Card>
        )}
      </Row>
    </Container>
    
    <CreateModal
      show={state.showNewModal}
      modalTitle='Play game'
      loading={createGame.isLoading}
      onHide={() => setState({ showNewModal: false })}
      initialState={{
        date: moment().format('YYYY-MM-DD'),
        score_1: '0',
        score_2: '0',
        team_1: null,
        team_2: null,
      }}
      formFields={formFields}
      validate={({ team_1, team_2, ...r }) => {
        if (!team_1 || !team_2) return false;
        if (team_1 === team_2) {
          return {
            team_1: 'Please select different teams',
            team_2: 'Please select different teams',
          }
        }
        return true;
      }}

      onSave={newGame => createGame(
        newGame,
        { callback: () => setState({ showNewModal: false }) }
      )}
    />
    <CreateModal
      show={state.showMatchMakerModal}
      modalTitle='Match maker'
      loading={matchMaker.isLoading}
      onHide={() => setState({ showMatchMakerModal: false })}
      initialState={{
        date: moment().format('YYYY-MM-DD'),
        teams: [],
      }}
      formFields={{
        date: { label: 'Date' },
        teams: {
          label: 'Select at least 2 teams',
          component: TeamsFormField,
        },
      }}
      validate={({ teams })  => teams.length >= 2}

      onSave={match => matchMaker(
        match,
        { callback: () => setState({ showMatchMakerModal: false }) }
      )}
    />

    {state.gameInEditModal &&
      <EditModal
        show={!!state.gameInEditModal}
        modalTitle='Modify game'
        loading={updateGame.isLoading}
        onHide={() => setState({ gameInEditModal: null })}
        initialState={state.gameInEditModal}
        formFields={formFields}
        validate={({ score_1, score_2 }) => (score_1 === null && score_2 === null) || (score_1 !== null && score_2 !== null)}
        onSave={game => updateGame(
          game,
          { callback: () => setState({ gameInEditModal: null }) }
        )}
    />}
  </>;
};

export default GamesList;