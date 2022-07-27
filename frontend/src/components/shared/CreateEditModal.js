import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';
import { SmallSpinner } from './LoadingIndicator';

class CreateEditModal extends Component {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        includeData: PropTypes.object.isRequired,
        initialState: PropTypes.object.isRequired,
        formFields: PropTypes.object.isRequired,
        show: PropTypes.bool,
        loading: PropTypes.bool,
        modalTitle: PropTypes.node.isRequired,
        validate: PropTypes.func,
    }
    static defaultProps = {
        show: true,
        loading: false,
        includeData: {},
        validate: null,
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
        const { validate } = this.props;
        const validated = validate ? validate(this.state) : true
        // console.log({validated}, validated !== true)
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                onClick={e => e.stopPropagation()}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modalTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {Object.entries(this.props.formFields).map(([key, { formProps = {}, label, component: Component }]) =>
                            <Form.Group controlId="name" key={key}>
                                {label && <Form.Label>{label}</Form.Label>}
                                {validated !== true && validated[key] && ` (${validated[key]})`}
                                {Component
                                    ?   <Component
                                            value={this.state[key] || ''}
                                            state={this.state}
                                            onChange={value => this.setState({ [key]: value })}
                                        />
                                    :   <Form.Control
                                            as="input"
                                            autoComplete="off"
                                            {...formProps}
                                            value={this.state[key] || ''}
                                            isInvalid={!!(validated !== true && validated[key])}
                                            onChange={e => this.setState({ [key]: e.target.value })}
                                            onKeyPress={e => {
                                                if (e.charCode === 13 && formProps.as !== 'textarea') {
                                                    // Pressing the enter key will save data unless it is a multi line text area
                                                    e.preventDefault();
                                                    this.onSave();
                                                }
                                            }}
                                        />
                                }
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
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={this.onSave}
                        disabled={validated !== true}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = () => ({});

export default connect(
    mapStateToProps,
)(CreateEditModal);
