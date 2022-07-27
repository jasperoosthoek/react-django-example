import React from 'react';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import { use } from '../../redux/factory';
import TeamPlayers from './TeamPlayers';

// https://www.geeksforgeeks.org/how-to-find-if-two-arrays-contain-any-common-item-in-javascript/
const containsCommonValues = (arr1, arr2) => {
  return arr1.some(item => arr2.includes(item))
};

const TeamText = ({ team }) => (
  <>
    {team.name}: &nbsp;
    <TeamPlayers team={team} component='span' separator=', '/>
  </>
);

const SelectionsDropdown = ({ onChange, value, opponent: opponentId }) => {
  const { teamsList } = use.teams();

  const opponentPlayers = opponentId ? teamsList[opponentId].players : null;
  const selectedTeam = value && teamsList[value];
  return (
    <ButtonGroup className='form-control form-control-lg'>
      <DropdownButton
        id='dropdown'
        title={selectedTeam && <TeamText team={selectedTeam} />}
        onClick={e => e.stopPropagation()}
        size='sm'
      >
        {teamsList && Object.values(teamsList)
          .sort(({ order: a }, { order: b }) => a > b)
          .map((team, key) =>
            <Dropdown.Item
              href='#'
              key={key}
              onClick={(e) => onChange(team.id)}
              active={selectedTeam && selectedTeam.id === team.id}
              disabled={opponentPlayers !== null && containsCommonValues(opponentPlayers, teamsList[team.id].players)}
            >
              <TeamText team={team} />
            </Dropdown.Item>
          )
        }
      </DropdownButton>
    </ButtonGroup>
  );
}

export default SelectionsDropdown;
