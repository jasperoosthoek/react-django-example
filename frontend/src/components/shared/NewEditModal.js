import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';
import { SmallSpinner } from './LoadingIndicator';

class NewEditModal extends Component {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        includeData: PropTypes.object.isRequired,
        initialState: PropTypes.object.isRequired,
        formFields: PropTypes.object.isRequired,
        show: PropTypes.bool,
        loading: PropTypes.bool,
        modalTitle: PropTypes.node.isRequired,
    }
    static defaultProps = {
        show: true,
        loading: false,
        includeData: {},
    }

    state = this.props.initialState

    componentDidMount() {
        this.setState(this.props.initialState);
    }

    componentDidUpdate({ show: prevShow }) {
        if (prevShow && prevShow !== this.props.show) {
            this.setState(this.props.initialState);
        }
    }

    onSave = e => {
        this.props.onSave(
            {
                ...this.state,
                ...this.props.includeData,
            },
            this.props.onHide,
        );
    }

    render() {

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modalTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {Object.entries(this.props.formFields).map(([key, { formProps = {}, label }]) =>
                            <Form.Group controlId="name" key={key}>
                                <Form.Label>{label}</Form.Label>
                                <Form.Control
                                    as="input"
                                    {...formProps}
                                    value={this.state[key] || ''}
                                    onChange={e => this.setState({ [key]: e.target.value })}
                                    onKeyPress={e => {
                                        if (e.charCode === 13 && formProps.as !== 'textarea') {
                                            // Pressing the enter key will save data unless it is a multi line text area
                                            e.preventDefault();
                                            this.onSave();
                                        }
                                    }}
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {this.props.loading && <SmallSpinner />}
                    <Button
                        variant="secondary"
                        onClick={this.props.onHide}
                    >
                        Sluiten
                    </Button>
                    <Button
                        variant="primary"
                        onClick={this.onSave}
                    >
                        Opslaan
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = () => ({});

export default connect(
    mapStateToProps,
)(NewEditModal);
