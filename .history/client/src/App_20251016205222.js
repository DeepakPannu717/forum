// src/App.js
// import React, { useState, useEffect } from "react";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
// import AddModal from "./components/AddModal";
// import api from "./services/api";
// import { Toast, ToastContainer, Container, Row, Col } from "react-bootstrap";

// function App() {
//   const [categories, setCategories] = useState([]);
//   const [selectedCat, setSelectedCat] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [modalType, setModalType] = useState(null);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState("success");
//   const [selectedTopic, setSelectedTopic] = useState(null);

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("/forum");
//       setCategories(res.data);
//       if (selectedCat && !res.data.find((c) => c._id === selectedCat._id)) {
//         setSelectedCat(null);
//       }
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const openAddModal = (type) => {
//     setModalType(type);
//     setShowAddModal(true);
//   };

//   const handleAdd = async (payload) => {
//     try {
//       const endpoint = modalType === "category" ? "/category" : "/topic";
//       const response = await api.post(endpoint, payload);

//       if (modalType === "category") {
//         setCategories((prev) => [...prev, response.data.category]);
//         setToastMessage("Category added successfully");
//       } else {
//         setToastMessage("Topic added successfully");
//       }

//       setToastVariant("success");
//       setShowAddModal(false);
//       fetchCategories(); // refresh list
//     } catch (error) {
//       setToastMessage("Failed to add " + modalType);
//       setToastVariant("danger");
//     }
//   };

//   const handleTopicSelect = (topic, category) => {
//   setSelectedCat(category);
//   setSelectedTopic(topic);
// };

//   return (
//     <>
//       <Header onAdd={openAddModal} />
//       <Container fluid>
//         <Row>
//           <Col md={3}>
//             <Sidebar
//               categories={categories}
//               onSelectCategory={setSelectedCat}
//               onSelectTopic={handleTopicSelect}
//             />
//           </Col>
//           {/* <Col md={9} className="p-3">
//             <h4>Welcome to the Forum</h4>
//             {selectedCat ? (
//               <div>
//                 <h5>Topics in: {selectedCat.name}</h5>
//                 <ul>
//                   {(selectedCat.topics ?? []).map((topic) => (
//                     <li key={topic._id}>{topic.name} </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p>Please select a category to see topics.</p>
//             )}
//           </Col> */}
//           {/* <Col md={9} className="p-3">
//             <h4>Welcome to the Forum</h4>
//             {selectedCat ? (
//               <div>
//                 <h5>Topics in: {selectedCat.name}</h5>
//                 <ul style={{ listStyleType: "none", padding: 0 }}>
//                   {(selectedCat.topics ?? []).map((topic) => (
//                     <li key={topic._id} className="mb-4">
//                       <strong>{topic.name}</strong>
//                       <textarea
//                         value={topic.codebase}
//                         readOnly
//                         rows={5}
//                         className="form-control mt-2"
//                         style={{
//                           fontFamily: "monospace",
//                           background: "#f8f9fa",
//                         }}
//                       />
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p>Please select a category to see topics.</p>
//             )}
//           </Col> */}
//           <Col md={9} className="p-3">
//             <h4>Welcome to the Forum</h4>
//             {selectedTopic ? (
//               <div>
//                 <h5>{selectedTopic.name}</h5>
//                 <textarea
//                   value={selectedTopic.codebase}
//                   readOnly
//                   rows={10}
//                   className="form-control"
//                   style={{ fontFamily: "monospace", background: "#f8f9fa" }}
//                 />
//               </div>
//             ) : selectedCat ? (
//               <div>
//                 <h5>Topics in: {selectedCat.name}</h5>
//                 <ul>
//                   {(selectedCat.topics ?? []).map((topic) => (
//                     <li key={topic._id}>{topic.name}</li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p>Please select a category to see topics.</p>
//             )}
//           </Col>
//         </Row>
//       </Container>

//       {showAddModal && (
//         <AddModal
//           type={modalType}
//           onAdd={handleAdd}
//           onClose={() => {
//             setShowAddModal(false);
//             setModalType(null);
//           }}
//           categories={categories}
//         />
//       )}

//       <ToastContainer position="bottom-end" className="p-3">
//         <Toast
//           bg={toastVariant}
//           show={!!toastMessage}
//           onClose={() => setToastMessage("")}
//           delay={3000}
//           autohide
//         >
//           <Toast.Body className="text-white">{toastMessage}</Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Stack, Toast } from 'react-bootstrap';
import Header from "./components/Header";
import AddModal from './components/AddModal';
import CategoryModal from './components/modals/CategoryModal';
import Sidebar from './components/Sidebar';
import TopicView from './components/TopicView';
import api from "./services/api";
import { ToastContainer, Row, Col } from "react-bootstrap";



function App() {
  // Existing state
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [selectedTopic, setSelectedTopic] = useState(null);

  // New state for category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryMode, setCategoryMode] = useState('category');
  const [categoryName, setCategoryName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      showToast("Error fetching categories", "danger");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
  };

  const openAddModal = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  // New functions for category/subcategory handling
  const openCategoryModal = (mode = 'category') => {
    setCategoryMode(mode);
    setCategoryName('');
    setParentCategoryId('');
    setSubcategoryName('');
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (data) => {
    try {
      if (data.type === 'subcategory') {
        const response = await fetch('/api/subcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            parentId: data.parentId
          })
        });
        const newSubcategory = await response.json();
        
        setCategories(prev => prev.map(cat => 
          cat._id === data.parentId
            ? {
                ...cat,
                subcategories: [...(cat.subcategories || []), newSubcategory]
              }
            : cat
        ));
        showToast("Subcategory added successfully");
      } else {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: data.name })
        });
        const newCategory = await response.json();
        
        setCategories(prev => [...prev, { ...newCategory, subcategories: [] }]);
        showToast("Category added successfully");
      }
      setShowCategoryModal(false);
    } catch (error) {
      showToast("Error adding category/subcategory", "danger");
    }
  };

  const handleAdd = async (payload) => {
    try {
      const endpoint = modalType === 'topic' ? '/api/topics' : '/api/categories';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (modalType === 'topic') {
        setCategories(prev => prev.map(cat => 
          cat._id === payload.categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub._id === payload.subcategoryId
                    ? { ...sub, topics: [...(sub.topics || []), data] }
                    : sub
                )
              }
            : cat
        ));
        showToast("Topic added successfully");
      }
      setShowAddModal(false);
    } catch (error) {
      showToast("Error adding " + modalType, "danger");
    }
  };

  const handleTopicSelect = (topic, category) => {
    setSelectedTopic(topic);
    setSelectedCat(category);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <Sidebar 
            categories={categories}
            onSelectCategory={setSelectedCat}
            onSelectTopic={handleTopicSelect}
          />
          <Stack direction="horizontal" gap={2} className="mt-3">
            <Button onClick={() => openCategoryModal('category')}>
              Add Category
            </Button>
            <Button onClick={() => openCategoryModal('subcategory')}>
              Add Subcategory
            </Button>
            <Button onClick={() => openAddModal('topic')}>
              Add Topic
            </Button>
          </Stack>
        </Col>
        <Col md={9}>
          {selectedTopic && <TopicView topic={selectedTopic} />}
        </Col>
      </Row>

      <AddModal
        show={showAddModal}
        type={modalType}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
        categories={categories}
      />

      <CategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        mode={categoryMode}
        categoryName={categoryName}
        onCategoryChange={setCategoryName}
        categories={categories}
        parentCategoryId={parentCategoryId}
        onParentCategoryChange={setParentCategoryId}
        subcategoryName={subcategoryName}
        onSubcategoryChange={setSubcategoryName}
        onSubmit={handleCategorySubmit}
      />

      <Toast
        show={!!toastMessage}
        onClose={() => setToastMessage("")}
        delay={3000}
        autohide
        className="position-fixed bottom-0 end-0 m-3"
        bg={toastVariant}
      >
        <Toast.Body className={toastVariant === "danger" ? "text-white" : ""}>
          {toastMessage}
        </Toast.Body>
      </Toast>
    </Container>
  );
}

export default App;