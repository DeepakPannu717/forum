// src/pages/ForumPage.js
import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Row, Col, Modal, Form, Button, Alert
} from 'react-bootstrap';
import {
  getForumData, createCategory, createTopic
} from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AddModal from '../components/AddModal';

export default function ForumPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState("");
  const categoryInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const data = await getForumData();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter category name");
      categoryInputRef.current?.focus();
      return;
    }

    try {
      const res = await createCategory(categoryName.trim());
      setCategorySuccess(`Category "${res.category.name}" created successfully!`);
      setCategoryName("");
      setShowCategoryModal(false);
      fetchCategories();
      setTimeout(() => setCategorySuccess(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error creating category. Make sure it’s unique.");
    }
  };

  const handleAddTopic = async () => {
    if (!selectedCategoryId || !topicName.trim()) {
      alert("Please select a category and enter topic name");
      return;
    }

    try {
      await createTopic(topicName.trim(), selectedCategoryId);
      setTopicName("");
      setSelectedCategoryId("");
      setShowTopicModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Error creating topic:", err);
    }
  };

  return (
    <Container fluid>
      <Header
        onAdd={(type) => {
          if (type === 'category') setShowCategoryModal(true);
          if (type === 'topic') setShowTopicModal(true);
        }}
      />

      {categorySuccess && (
        <Alert variant="success" className="text-center mt-2">
          {categorySuccess}
        </Alert>
      )}

      <Row>
        <Sidebar data={categories} onSelect={() => {}} />

        <Col md={10} className="p-3">
          <h4>Welcome to the Forum!</h4>
          <p>Select a category and add a topic using the buttons above.</p>
        </Col>
      </Row>

      <Footer />

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              ref={categoryInputRef}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Topic Modal */}
      <Modal show={showTopicModal} onHide={() => setShowTopicModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formCategory">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-3" controlId="formTopic">
            <Form.Label>Topic Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter topic name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTopicModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTopic}>
            Add Topic
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
