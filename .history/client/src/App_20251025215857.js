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
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

// Custom styles
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

  .cursor-pointer {
    cursor: pointer;
  }

  .list-unstyled li:hover {
    background-color: #f8f9fa;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const highlightCode = (code) => {
    if (!code) return '';
    const language = selectedTopic?.language || 'javascript';
    return Prism.highlight(
      code,
      Prism.languages[language] || Prism.languages.javascript,
      language
    );
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      if (selectedCat && !res.data.find((c) => c._id === selectedCat._id)) {
        setSelectedCat(null);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setToastMessage("Error fetching categories: " + error.message);
      setToastVariant("danger");
    } finally {
      setIsLoading(false);
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
      const endpoint = modalType === "category" ? "/categories" : "/topics";
      const response = await api.post(endpoint, payload);

      if (modalType === "category") {
        setCategories((prev) => [...prev, response.data]);
        setToastMessage("Category added successfully");
      } else {
        await fetchCategories(); // Refresh to get updated topics
        setToastMessage("Topic added successfully");
      }

      setToastVariant("success");
      setShowAddModal(false);
    } catch (error) {
      setToastMessage("Failed to add " + modalType + ": " + error.message);
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
            {isLoading ? (
              <div className="p-3">Loading categories...</div>
            ) : (
              <Sidebar
                categories={categories}
                onSelectCategory={setSelectedCat}
                onSelectTopic={handleTopicSelect}
              />
            )}
          </Col>
          <Col md={9} className="p-3">
            {isLoading ? (
              <div>Loading content...</div>
            ) : selectedTopic ? (
              <div>
                <h5>{selectedTopic.name}</h5>
                <div
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "0.25rem",
                    maxHeight: "500px",
                    backgroundColor: "#2d2d2d",
                    overflow: "auto",
                    position: "relative"
                  }}
                >
                  <Editor
                    value={selectedTopic.codebase || ''}
                    onValueChange={() => {}}
                    highlight={highlightCode}
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                      backgroundColor: "#2d2d2d",
                      color: "#ccc",
                      minHeight: "100px",
                      height: "auto",
                      maxHeight: "500px"
                    }}
                    readOnly={true}
                    className="editor-scrollable"
                  />
                </div>
                {selectedTopic.output && (
                  <div className="mt-3">
                    <h6>Output:</h6>
                    <pre 
                      className="p-3 bg-light border rounded"
                      style={{
                        maxHeight: "200px",
                        overflow: "auto"
                      }}
                    >
                      {selectedTopic.output}
                    </pre>
                  </div>
                )}
                <div className="mt-2 text-muted">
                  Language: {selectedTopic.language || 'javascript'}
                  {selectedTopic.status && (
                    <span className="ms-3">Status: {selectedTopic.status}</span>
                  )}
                </div>
              </div>
            ) : selectedCat ? (
              <div>
                <h5>Topics in: {selectedCat.name}</h5>
                <ul className="list-unstyled">
                  {(selectedCat.topics ?? []).map((topic) => (
                    <li 
                      key={topic._id}
                      className="p-2 border-bottom cursor-pointer"
                      onClick={() => handleTopicSelect(topic, selectedCat)}
                      style={{ cursor: 'pointer' }}
                    >
                      {topic.name}
                    </li>
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
          <Toast.Body className={toastVariant === "danger" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;