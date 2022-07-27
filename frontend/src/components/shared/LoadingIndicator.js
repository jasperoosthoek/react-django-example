import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

export default () => (
    <Spinner animation="border" role="status">
        <span className="sr-only">De gegevens worden geladen...</span>
    </Spinner>
);

export const SmallSpinner = () => (
    <Button variant="link" disabled size="sm">
        <Spinner animation="border" role="status" size="sm" />
    </Button>
);