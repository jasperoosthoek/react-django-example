import React from 'react';
import { FormBadgesSelection } from '../shared/ReactToolbox';
import { use } from '../../redux/factory';

const PlayersFormField = props => {
  const { playersList } = use.players();
  return (
    <FormBadgesSelection
      list={Object.values(playersList)}
      style={{ marginRight: '4px' }}
      multiple
      {...props}
    />
  );
};

export default PlayersFormField;