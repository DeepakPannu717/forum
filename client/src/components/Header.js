// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';


export default function Header({ onAdd, onToggleTopicList }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Forum App</Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="warning" className="me-2" onClick={() => onAdd("category")}>Add Category</Button>
          <Button variant="danger" className="me-2" onClick={() => onAdd("topic")}>Add Topic</Button>
          <Button variant="info" className="me-2" onClick={onToggleTopicList}>Topic List</Button>

          <Button variant="outline-light" className="me-2">Login</Button>
          <Button variant="outline-light">Register</Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
