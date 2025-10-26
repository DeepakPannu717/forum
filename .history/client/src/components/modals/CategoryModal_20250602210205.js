import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function CategoryModal({
  show,
  onHide,
  categoryName,
  onChange,
  onSubmit
}) {
  const inputRef = useRef(null);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Add Category</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            value={categoryName}
            ref={inputRef}
            onChange={onChange}
            placeholder="Enter category name"
            autoFocus
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}