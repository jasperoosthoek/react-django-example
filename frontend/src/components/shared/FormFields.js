import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

export const FormSelect = ({ controlId, label, formProps, onChange, options, defaultValue }) =>
    <Form.Group controlId={controlId}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control as="select"
            onChange={e => onChange(e.target.value)}
            {...formProps}
        >
            {options.map(({ value, children, ...option }) =>
                <option
                    key={value}
                    value={value}
                    defaultValue={defaultValue}
                    {...option}
                >
                    {children}
                </option>
            )}
        </Form.Control>
    </Form.Group>;

export const FormInput = ({ label, value, onEnter, onChange, controlId, ...formProps }) =>
    <Form.Group controlId={controlId}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
            autoComplete="off"
            {...formProps}
            as="input"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            onKeyPress={e => {
                if (e.charCode === 13 && typeof onEnter === 'function') {
                    e.preventDefault();
                    onEnter();
                }
            }}
        />
    </Form.Group>

export const FormTextArea = ({ formProps, ...restProps }) =>
    <FormInput
        formProps={{ ...formProps, as: 'textarea' }}
        {...restProps}
    />