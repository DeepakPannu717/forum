// src/App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AddModal from "./components/AddModal";
import api from "./services/api";
import { Toast, ToastContainer, Container, Row, Col } from "react-bootstrap";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/forum");
      setCategories(res.data);
      if (selectedCat && !res.data.find((c) => c._id === selectedCat._id)) {
        setSelectedCat(null);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const handleAdd = async (payload) => {
    try {
      const endpoint = modalType === "category" ? "/category" : "/topic";
      const response = await api.post(endpoint, payload);

      if (modalType === "category") {
        setCategories((prev) => [...prev, response.data.category]);
        setToastMessage("Category added successfully");
      } else {
        setToastMessage("Topic added successfully");
      }

      setToastVariant("success");
      setShowAddModal(false);
      fetchCategories(); // refresh list
    } catch (error) {
      setToastMessage("Failed to add " + modalType);
      setToastVariant("danger");
    }
  };

  const handleTopicSelect = (topic, category) => {
  setSelectedCat(category);
  setSelectedTopic(topic);
};

  return (
    <>
      <Header onAdd={openAddModal} />
      <Container fluid>
        <Row>
          <Col md={3}>
            <Sidebar
              categories={categories}
              onSelectCategory={setSelectedCat}
              onSelectTopic={handleTopicSelect}
            />
          </Col>
          {/* <Col md={9} className="p-3">
            <h4>Welcome to the Forum</h4>
            {selectedCat ? (
              <div>
                <h5>Topics in: {selectedCat.name}</h5>
                <ul>
                  {(selectedCat.topics ?? []).map((topic) => (
                    <li key={topic._id}>{topic.name} </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Please select a category to see topics.</p>
            )}
          </Col> */}
          {/* <Col md={9} className="p-3">
            <h4>Welcome to the Forum</h4>
            {selectedCat ? (
              <div>
                <h5>Topics in: {selectedCat.name}</h5>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {(selectedCat.topics ?? []).map((topic) => (
                    <li key={topic._id} className="mb-4">
                      <strong>{topic.name}</strong>
                      <textarea
                        value={topic.codebase}
                        readOnly
                        rows={5}
                        className="form-control mt-2"
                        style={{
                          fontFamily: "monospace",
                          background: "#f8f9fa",
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Please select a category to see topics.</p>
            )}
          </Col> */}
          <Col md={9} className="p-3">
            <h4>Welcome to the Forum</h4>
            {selectedTopic ? (
              <div>
                <h5>{selectedTopic.name}</h5>
                <textarea
                  value={selectedTopic.codebase}
                  readOnly
                  rows={10}
                  className="form-control"
                  style={{ fontFamily: "monospace", background: "#f8f9fa" }}
                />
              </div>
            ) : selectedCat ? (
              <div>
                <h5>Topics in: {selectedCat.name}</h5>
                <ul>
                  {(selectedCat.topics ?? []).map((topic) => (
                    <li key={topic._id}>{topic.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Please select a category to see topics.</p>
            )}
          </Col>
        </Row>
      </Container>

      {showAddModal && (
        <AddModal
          type={modalType}
          onAdd={handleAdd}
          onClose={() => {
            setShowAddModal(false);
            setModalType(null);
          }}
          categories={categories}
        />
      )}

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toastVariant}
          show={!!toastMessage}
          onClose={() => setToastMessage("")}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
