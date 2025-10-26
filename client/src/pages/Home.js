import React, { useEffect, useRef, useState } from 'react';
import {
  Container, Row, Col, Alert, Modal, Form, Button
} from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { getForumData, createCategory, createTopic } from '../services/api';

export default function Home() {
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
      // getForumData now returns an array of categories
      setCategories(Array.isArray(data) ? data : data?.categories || []);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter category name");
      categoryInputRef.current?.focus();
      return;
    }

    try {
  const res = await createCategory({ name: categoryName.trim() });
  setCategorySuccess(`Category "${res.category.name}" created successfully!`);
      setCategoryName("");
      setShowCategoryModal(false);
      fetchCategories();

      setTimeout(() => setCategorySuccess(""), 3000);
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Category might already exist or server error.");
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
      console.error("Error creating topic", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container fluid>
      <Header onAdd={(type) => {
        if (type === "category") setShowCategoryModal(true);
        if (type === "topic") setShowTopicModal(true);
      }} />

      {categorySuccess && <Alert variant="success" className="text-center mt-2">{categorySuccess}</Alert>}

      <Row>
        <Sidebar data={categories} onSelect={() => {}} />
        <Col md={10} className="p-3">
          <h4>Welcome to the Forum!</h4>
          <p>Select a category and add a topic using the buttons above.</p>
        </Col>
      </Row>

      <Footer />

      {/* Add Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Category</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              ref={categoryInputRef}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Topic Modal */}
      <Modal show={showTopicModal} onHide={() => setShowTopicModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Topic</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Category</Form.Label>
            <Form.Select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
              <option value="">-- Select --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Topic Name</Form.Label>
            <Form.Control
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter topic name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTopicModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddTopic}>Add Topic</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
