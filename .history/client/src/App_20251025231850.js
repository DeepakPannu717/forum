// src/App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AddModal from "./components/AddModal";
import api from "./services/api";
import { Toast, ToastContainer, Container, Row, Col } from "react-bootstrap";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-jsx";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const highlightCode = (code) => {
    if (!code) return "";
    const language = selectedTopic?.language || "javascript";
    return Prism.highlight(
      code,
      Prism.languages[language] || Prism.languages.javascript,
      language
    );
  };

  // Add this near the top of your App.js, after the imports
const styles = `
  .editor-scrollable textarea {
    min-height: 100px !important;
    max-height: 500px !important;
    overflow-y: auto !important;
  }
  
  .editor-scrollable pre {
    max-height: 500px !important;
    overflow-y: auto !important;
  }
  
  /* Custom scrollbar styling */
  .editor-scrollable *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .editor-scrollable *::-webkit-scrollbar-track {
    background: #2d2d2d;
  }
  
  .editor-scrollable *::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
  }
  
  .editor-scrollable *::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  }
`;

// Add this right after the styles constant
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

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

  // fetchCategories doesn't change between renders; disable exhaustive-deps warning
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "0.25rem",
                    maxHeight: "500px",
                    backgroundColor: "#2d2d2d",
                    overflow: "auto",
                    padding: 10,
                  }}
                >
                  <Editor
                    value={selectedTopic.codebase || ""}
                    onValueChange={() => {}} // read-only
                    highlight={highlightCode}
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                      backgroundColor: "#2d2d2d",
                      color: "#ccc",
                      minHeight: "100px",
                      maxHeight: "500px",
                      display: "block",
                      overflow: "auto",
                      whiteSpace: "pre",
                    }}
                    readOnly={true}
                  />
                </div>

                {selectedTopic.output && (
                  <div className="mt-3">
                    <h6>Output:</h6>
                    <pre className="p-3 bg-light border rounded" style={{ maxHeight: 200, overflow: 'auto' }}>
                      {selectedTopic.output}
                    </pre>
                  </div>
                )}

                <div className="mt-2 text-muted">
                  Language: {selectedTopic.language || "javascript"}
                </div>
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
