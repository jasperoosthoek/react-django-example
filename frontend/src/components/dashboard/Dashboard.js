import React, { useEffect } from 'react';
import {  Navbar, Nav, Tabs, Tab } from 'react-bootstrap';
// import _ from 'lodash';
import Websocket from 'react-websocket';
import { toast } from 'react-toastify';

import { use } from '../../redux/factory';

import { useSetState } from '../shared/ReactToolbox';
import { useLogin } from '../shared/Login';
import PlayersList from '../players/PlayersList';
import TeamsList from '../teams/TeamsList';
import GamesList from '../games/GamesList';
import { useAuth } from '../shared/Login';

const Dashboard = () => {
  const [state, setState] = useSetState({ activeTab: 'players' });
  const { user } = useAuth();
  const { logout } = useLogin();
  const { getPlayersList, playersList } = use.players();
  const { getTeamsList, teamsList } = use.teams();
  const { getGamesList } = use.games();

  useEffect(() => {
    getPlayersList();
    getTeamsList();
    getGamesList();
  }, []);

  return (
    <>
      <Navbar bg='light'>
        <Navbar.Brand href='/'>Table Tennis Game</Navbar.Brand>
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>
            User: <b>{user.username}</b>
          </Navbar.Text>
          <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
      <Tabs
        activeKey={state.activeTab}
        onSelect={tab => setState({ activeTab: tab })}
        className='mb-3'
      >
        <Tab
          eventKey='players'
          title='Players'
        >
          <PlayersList />
        </Tab>
        <Tab
          eventKey='teams'
          title='Teams'
          disabled={!playersList}
        >
          {playersList && Object.keys(playersList).length === 0
            ? <i>Create at least one player</i>
            : <TeamsList />
          }
        </Tab>
        <Tab
          eventKey='games'
          title='Games'
          disabled={!teamsList}
        >
          {teamsList && Object.keys(teamsList).length < 2
            ? <i>Create at least two teams</i>
            : <GamesList />
          }
        </Tab>
      </Tabs>
    </>
  );
};

export default Dashboard;