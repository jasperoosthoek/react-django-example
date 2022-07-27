import React from 'react';
import { Card, Container, Row } from 'react-bootstrap';

import {
  useSetState,
  CreateEditModal as CreateModal,
  CreateEditModal as EditModal,
  CreateButton,
  DeleteConfirmButton,
  LoadingIndicator,
  useLocalization,
  DataTable,
} from '../shared/ReactToolbox';
import { use } from '../../redux/factory';

const PlayersList = () => {
  const [state, setState] = useSetState({
    playerInEditModal: null,
    showNewModal: false,
  });
  const {
    getPlayersList,
    playersList,
    createPlayer,
    updatePlayer,
    deletePlayer,
  } = use.players();
  const { strings } = useLocalization();
  
  if (getPlayersList.isLoading || !playersList) return <LoadingIndicator />;
  
  const formFields = { name: { label: strings.name, required: true } };
  
  return <>
    <Container className='container-item'>
      <DataTable
      
        showHeader={false}
        columns={[
          {
            name: strings.name,
            selector: 'name',
          },
          {
            name: strings.actions,
            selector: player => (
              <>
                <DeleteConfirmButton
                  modalTitle={strings.delete_player}
                  onDelete={() => deletePlayer(player)}
                  loading={deletePlayer.isLoading}
                  className='float-end'
                />
              </>
            ),
          }
        ]}
        data={Object.values(playersList)}
        onClickRow={player => setState({ playerInEditModal: player })}
      />
      <CreateButton onClick={() => setState({ showNewModal: true })} />
    </Container>

    {state.playerInEditModal &&
      <EditModal
        show={!!state.playerInEditModal}
        modalTitle={strings.modify_player}
        loading={updatePlayer.isLoading}
        onHide={() => setState({ playerInEditModal: null })}
        initialState={state.playerInEditModal}
        formFields={formFields}

        onSave={player => updatePlayer(
          player,
          { callback: () => setState({ playerInEditModal: null }) }
        )}
    />}
    
    <CreateModal
      show={state.showNewModal}
      modalTitle={strings.new_player}
      loading={createPlayer.isLoading}
      onHide={() => setState({ showNewModal: false })}
      initialState={{ name: '' }}
      formFields={formFields}

      onSave={newPlayer => createPlayer(
        newPlayer,
        { callback: () => setState({ showNewModal: false }) }
      )}
    />
  </>;
};

export default PlayersList;