// src/App.js
import React, { useState, useEffect } from "react";
import { Toast, ToastContainer, Container, Row, Col } from "react-bootstrap";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-jsx";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AddModal from "./components/AddModal";
import TopicList from "./components/TopicList";
import api from "./services/api";

// Styles
const editorStyles = {
  container: {
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    maxHeight: "500px",
    backgroundColor: "#2d2d2d",
    overflow: "auto",
    padding: 10,
  },
  editor: {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 14,
    backgroundColor: "#2d2d2d",
    color: "#ccc",
    minHeight: "100px",
    maxHeight: "500px",
    display: "block",
    overflow: "auto",
    whiteSpace: "pre",
  },
  topicHeader: {
    backgroundColor: "#16e6b8ff",
    borderRadius: "2px",
    padding: "10px",
  },
  output: {
    maxHeight: 200,
    overflow: "auto",
  },
};

// Custom scrollbar styles
const scrollbarStyles = `
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
`;

// Apply scrollbar styles
const styleSheet = document.createElement("style");
styleSheet.innerText = scrollbarStyles;
document.head.appendChild(styleSheet);

// Topic View Component
const TopicView = ({ topic }) => {
  if (!topic) return null;

  const highlightCode = (code) => {
    if (!code) return "";
    const language = topic?.language || "javascript";
    return Prism.highlight(
      code,
      Prism.languages[language] || Prism.languages.javascript,
      language
    );
  };

  return (
    <div>
      <h6 className="p-2 mb-3" style={editorStyles.topicHeader}>
        Q{topic.topicNumber || 1}. {topic.name}
      </h6>
      <div style={editorStyles.container}>
        <Editor
          value={topic.codebase || ""}
          onValueChange={() => {}}
          highlight={highlightCode}
          padding={10}
          style={editorStyles.editor}
          readOnly={true}
        />
      </div>

      {topic.output && (
        <div className="mt-3">
          <h6>Output:</h6>
          <pre
            className="p-3 bg-light border rounded"
            style={editorStyles.output}
          >
            {topic.output}
          </pre>
        </div>
      )}

      <div className="mt-2 text-muted">
        Language: {topic.language || "javascript"}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicList, setShowTopicList] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/forum");
        setCategories(res.data);
        if (selectedCat && !res.data.find((c) => c._id === selectedCat._id)) {
          setSelectedCat(null);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showToast("Failed to fetch categories", "danger");
      }
    };

    fetchCategories();
  }, [selectedCat]);

  const showToast = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
  };

  const handleAdd = async (payload) => {
    try {
      const endpoint = modalType === "category" ? "/category" : "/topic";
      const response = await api.post(endpoint, payload);

      if (modalType === "category") {
        setCategories((prev) => [...prev, response.data.category]);
        showToast("Category added successfully");
      } else {
        showToast("Topic added successfully");
      }

      setShowAddModal(false);

      // Refresh categories
      const res = await api.get("/forum");
      setCategories(res.data);
    } catch (error) {
      showToast(`Failed to add ${modalType}`, "danger");
    }
  };

  const handleTopicSelect = (topic, category) => {
    setSelectedCat(category);
    const topicIndex =
      category.topics?.findIndex((t) => t._id === topic._id) ?? -1;
    setSelectedTopic({ ...topic, topicNumber: topicIndex + 1 });
  };

  return (
    <>
      <Header
        onAdd={(type) => {
          setModalType(type);
          setShowAddModal(true);
        }}
        onToggleTopicList={() => setShowTopicList(prev => !prev)}
      />
      <Container fluid>
        <Row>
          <Col md={4}>
            <Sidebar
              categories={categories}
              onSelectCategory={setSelectedCat}
              onSelectTopic={handleTopicSelect}
            />
          </Col>
          <Col md={7} className="p-3">
            {showTopicList ? (
              <TopicList
                categories={categories}
                onSelectTopic={(topic, category) => {
                  handleTopicSelect(topic, category);
                  setShowTopicList(false);
                }}
              />
            ) : selectedTopic ? (
              <TopicView topic={selectedTopic} />
            ) : selectedCat ? (
              <div>
                <h5>Topics in: {selectedCat.name}</h5>
                <ul>
                  {(selectedCat.topics ?? []).map((topic, index) => (
                    <li
                      key={topic._id}
                      onClick={() => handleTopicSelect(topic, selectedCat)}
                      style={{ cursor: "pointer" }}
                      className="py-2 border-bottom"
                    >
                      {index + 1}. {topic.name}
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
