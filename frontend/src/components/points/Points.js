import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Card, Container, Row } from 'react-bootstrap';

import LoadingIndicator from '../shared/LoadingIndicator';
import CreateEditModal from '../shared/CreateEditModal';
import { CreateButton, DeleteConfirmButton } from '../shared/IconButtons';
import { mapToProps, actions } from '../../redux/factory';

class Points extends Component {
  state = {
    showNewModal: false

  }
  componentDidMount() {
    this.props.getPointsList();
  }

  render() {
    const { getPointsIsLoading, pointsList } = this.props;
    
    if (getPointsIsLoading || !pointsList) return <LoadingIndicator />;
    
    return <>
      fgsdf
    </>;
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...mapToProps.points(state),
});

export default connect(mapToProps.points, {
  ...actions.points,
})(Points);