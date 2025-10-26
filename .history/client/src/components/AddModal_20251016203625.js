// // src/components/AddModal.js
// import React, { useState, useEffect, useRef } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import Editor from "react-simple-code-editor";
// import Prism from "prismjs";
// import "prismjs/themes/prism-tomorrow.css";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-python";

// export default function AddModal({ type, onAdd, onClose, categories = [] }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     categoryId: "",
//     codebase: "",
//     output: "",
//     status: "active",
//   });
//   const [language, setLanguage] = useState("javascript");
//   const [errors, setErrors] = useState({});
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (inputRef.current) inputRef.current.focus();
//   }, []);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (type === "topic" && !formData.categoryId)
//       newErrors.categoryId = "Category is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const highlightCode = (code) =>
//     Prism.highlight(code, Prism.languages[language], language);

//   const handleSubmit = () => {
//     if (!validate()) return;
//     const payload =
//       type === "topic"
//         ? {
//             name: formData.name,
//             categoryId: formData.categoryId,
//             codebase: formData.codebase,
//             output: formData.output,
//             status: formData.status,
//             language,
//           }
//         : { name: formData.name };

//     onAdd(payload);
//   };

//   return (
//     <Modal show onHide={onClose} size="lg" scrollable>
//       <Modal.Header closeButton>
//         <Modal.Title>Add {type}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>{type} Name</Form.Label>
//             <Form.Control
//               ref={inputRef}
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               isInvalid={!!errors.name}
//               placeholder={`Enter ${type} name`}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.name}
//             </Form.Control.Feedback>
//           </Form.Group>

//           {type === "topic" && (
//             <>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category</Form.Label>
//                 <Form.Select
//                   name="categoryId"
//                   value={formData.categoryId}
//                   onChange={handleChange}
//                   isInvalid={!!errors.categoryId}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//                 <Form.Control.Feedback type="invalid">
//                   {errors.categoryId}
//                 </Form.Control.Feedback>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Language</Form.Label>
//                 <Form.Select
//                   name="language"
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                 >
//                   <option value="javascript">JavaScript</option>
//                   <option value="python">Python</option>
//                   <option value="react">React</option>
//                   <option value="node">Node</option>
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Codebase</Form.Label>
//                 <div
//                   style={{
//                     border: "1px solid #ced4da",
//                     borderRadius: "0.25rem",
//                     minHeight: "150px",
//                     fontFamily: "monospace",
//                     fontSize: 14,
//                     padding: "10px",
//                     backgroundColor: "#2d2d2d",
//                     color: "#ccc",
//                   }}
//                 >
//                   <Editor
//                     value={formData.codebase}
//                     onValueChange={(codebase) =>
//                       setFormData((prev) => ({ ...prev, codebase }))
//                     }
//                     highlight={highlightCode}
//                     padding={10}
//                     style={{
//                       fontFamily: '"Fira code", monospace',
//                       fontSize: 14,
//                       outline: 0,
//                       minHeight: 140,
//                     }}
//                   />
//                 </div>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Output</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   name="output"
//                   rows={2}
//                   value={formData.output}
//                   onChange={handleChange}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button variant="primary" onClick={handleSubmit}>
//           Add
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// // src/components/AddModal.js
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";

// ...existing code...
export default function AddModal({ type, onAdd, onClose, categories = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "", // <-- add this
    codebase: "",
    output: "",
    status: "active",
  });
  const [language, setLanguage] = useState("javascript");
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (type === "topic" && !formData.categoryId)
      newErrors.categoryId = "Category is required";
    if (type === "topic" && !formData.subcategoryId)
      newErrors.subcategoryId = "Subcategory is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {})
     }));
    };

    // add this to fix the eslint no-undef for highlightCode
  const highlightCode = (code) =>
    Prism.highlight(
      code || "",
      // fallback to javascript if the selected language isn't loaded
      Prism.languages[language] || Prism.languages.javascript,
      language
    );

  // ...existing code...

  const handleSubmit = () => {
    if (!validate()) return;
    const payload =
      type === "topic"
        ? {
            name: formData.name,
            categoryId: formData.categoryId,
            subcategoryId: formData.subcategoryId, // <-- add this
            codebase: formData.codebase,
            output: formData.output,
            status: formData.status,
            language,
          }
        : { name: formData.name };

    onAdd(payload);
  };

  return (
    <Modal show onHide={onClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{type} Name</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder={`Enter ${type} name`}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {type === "topic" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryId}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categoryId}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Subcategory field */}
              <Form.Group className="mb-3">
                <Form.Label>Subcategory</Form.Label>
                <Form.Select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  isInvalid={!!errors.subcategoryId}
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((cat) => cat._id === formData.categoryId)?.subcategories?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.subcategoryId}
                </Form.Control.Feedback>
              </Form.Group>
              {/* End subcategory */}

              {/* ...existing topic fields... */}
              <Form.Group className="mb-3">
                <Form.Label>Language</Form.Label>
                <Form.Select
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="react">React</option>
                  <option value="node">Node</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Codebase</Form.Label>
                <div
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "0.25rem",
                    minHeight: "150px",
                    fontFamily: "monospace",
                    fontSize: 14,
                    padding: "10px",
                    backgroundColor: "#2d2d2d",
                    color: "#ccc",
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
                      minHeight: 140,
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Output</Form.Label>
                <Form.Control
                  as="textarea"
                  name="output"
                  rows={2}
                  value={formData.output}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
// ...existing code...