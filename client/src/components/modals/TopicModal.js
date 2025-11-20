import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { createTopic, updateTopic } from '../../services/api';
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";

export default function TopicModal({ 
  show, 
  onHide, 
  categories, 
  onSuccess, 
  topic = null // Pass existing topic for edit mode
}) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    language: 'javascript',
    codebase: '',
    output: '',
    status: 'active'
  });

  const highlightCode = (code) =>
    Prism.highlight(
      code || "",
      Prism.languages[formData.language] || Prism.languages.javascript,
      formData.language
    );

  useEffect(() => {
    // If topic is provided, we're in edit mode
    if (topic) {
      // If the topic object contains nested category info from TopicList
      // (topic.category._id and topic.category.parentId), prefer that for selection.
      const hasNestedCategory = !!(topic.category && topic.category._id);
      let catId = '';
      let subcatId = '';
      if (hasNestedCategory) {
        // If category has parentId, the topic was under a subcategory.
        if (topic.category.parentId) {
          catId = topic.category.parentId;
          subcatId = topic.category._id;
        } else {
          catId = topic.category._id;
          subcatId = '';
        }
      } else {
        // Fallback to flat fields if provided by server
        catId = topic.categoryId || '';
        subcatId = topic.subcategoryId || '';
      }

      setFormData({
        name: topic.name || '',
        categoryId: catId,
        subcategoryId: subcatId,
        language: topic.language || 'javascript',
        codebase: topic.codebase || '',
        output: topic.output || '',
        status: topic.status || 'active'
      });
    } else {
      // Reset form for new topic
      setFormData({
        name: '',
        categoryId: '',
        subcategoryId: '',
        language: 'javascript',
        codebase: '',
        output: '',
        status: 'active'
      });
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      
      // If using subcategory, use that as the categoryId
      const submitData = {
        ...formData,
        categoryId: formData.subcategoryId || formData.categoryId
      };
      
      console.log('Processing submit with data:', submitData);
      let result;
      if (topic) {
        // Update existing topic
        result = await updateTopic(topic._id, submitData);
      } else {
        // Create new topic
        result = await createTopic(submitData);
      }
      console.log('Submission successful:', result);
      onSuccess(result);
      onHide();
    } catch (error) {
      console.error('Error saving topic:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        formData
      });
      alert(`Failed to save topic: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // If category changes, reset subcategory selection
      ...(name === 'categoryId' ? { subcategoryId: '' } : {})
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="custom-topic-modal">
      <Modal.Header closeButton>
        <Modal.Title>{topic ? 'Update Topic' : 'Add New Topic'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Topic Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter topic name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Subcategory selector: shown when the selected category has subcategories */}
          {(() => {
            const selectedCat = categories.find(c => c._id === formData.categoryId);
            if (selectedCat && selectedCat.subcategories && selectedCat.subcategories.length > 0) {
              return (
                <Form.Group className="mb-3">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Select
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={handleChange}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCat.subcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              );
            }
            return null;
          })()}

          <Form.Group className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="jsx">JSX/React</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <div
              style={{
                border: "1px solid #ced4da",
                borderRadius: "0.25rem",
                height: "400px", // Fixed height for scrolling
                fontFamily: "monospace",
                fontSize: 14,
                padding: "10px",
                backgroundColor: "#2d2d2d",
                color: "#ccc",
                overflow: "auto" // Enable scrolling
              }}
            >
              <Editor
                value={formData.codebase}
                onValueChange={(codebase) =>
                  setFormData((prev) => ({ ...prev, codebase }))
                }
                highlight={highlightCode}
                padding={10}
                style={{
                  fontFamily: '"Fira code", monospace',
                  fontSize: 14,
                  outline: 0,
                  height: "100%", // Take full height of parent
                  overflow: "visible", // Show all content
                  minHeight: "380px" // Allow content to expand
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Output</Form.Label>
            <Form.Control
              as="textarea"
              name="output"
              value={formData.output}
              onChange={handleChange}
              rows={3}
              placeholder="Enter expected output"
            />
          </Form.Group>

          {topic && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="draft">Draft</option>
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">
            {topic ? 'Update Topic' : 'Create Topic'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
