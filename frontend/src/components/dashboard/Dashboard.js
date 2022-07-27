import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Navbar, Nav, Tabs, Tab } from 'react-bootstrap';
// import _ from 'lodash';
import Websocket from 'react-websocket';
import { toast } from 'react-toastify';

import { mapToProps, actions } from '../../redux/factory';

import { logout } from '../shared/Login';
import PlayersList from '../players/PlayersList';
import TeamsList from '../teams/TeamsList';
import GamesList from '../games/GamesList';

class Dashboard extends Component {

  state = {
    activeTab: 'players',  }

  componentDidMount() {
    this.props.getPlayersList();
    this.props.getTeamsList();
    this.props.getGamesList();
  }

  render() {
    const { user } = this.props.auth;
    const { playersList, teamsList, gamesList } = this.props;
    return (
      <div>
        <Navbar bg='light'>
          <Navbar.Brand href='/'>Table Tennis Game</Navbar.Brand>
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text>
              User: <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link onClick={() => this.props.logout()}>Logout</Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        <Tabs
          activeKey={this.state.activeTab}
          onSelect={tab => this.setState({ activeTab: tab })}
          className="mb-3"
        >
          <Tab
            eventKey="players"
            title="Players"
          >
            <PlayersList />
          </Tab>
          <Tab
            eventKey="teams"
            title="Teams"
            disabled={!playersList || Object.keys(playersList).length === 0}
          >
            <TeamsList />
          </Tab>
          <Tab
            eventKey="games"
            title="Games"
            disabled={!teamsList || Object.keys(teamsList).length < 2}
          >
            <GamesList />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownState) => ({
  auth: state.auth,
  ...mapToProps.players(state),
  ...mapToProps.teams(state),
  ...mapToProps.games(state),
});

export default connect(mapStateToProps, {
  logout,
  ...actions.players,
  ...actions.teams,
  ...actions.games,
})(Dashboard);
