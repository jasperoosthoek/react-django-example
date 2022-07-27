import React from 'react';
import { Badge } from 'react-bootstrap';

import { use } from '../../redux/factory';

const TeamsFormField = ({ value: teamIds, onChange }) => {
  const { teamsList } = use.teams();
  return (
    <div className='form-control-lg'>
      {Object.values(teamsList).map((team, key) => {
        const isInTeam = teamIds.find(id => { return id === team.id });

        return (
          <span key={key}>
            <Badge
              variant={isInTeam ? 'primary' : 'secondary'}
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
        );
      })}
    </div>
  );
};


export default TeamsFormField;