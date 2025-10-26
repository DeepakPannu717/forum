// import React, { useRef } from 'react';
// import { Modal, Form, Button } from 'react-bootstrap';

// export default function CategoryModal({
//   show,
//   onHide,
//   categoryName,
//   onChange,
//   onSubmit
// }) {
//   const inputRef = useRef(null);

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton><Modal.Title>Add Category</Modal.Title></Modal.Header>
//       <Modal.Body>
//         <Form.Group>
//           <Form.Label>Category Name</Form.Label>
//           <Form.Control
//             type="text"
//             value={categoryName}
//             ref={inputRef}
//             onChange={onChange}
//             placeholder="Enter category name"
//             autoFocus
//           />
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>Cancel</Button>
//         <Button variant="primary" onClick={onSubmit}>Add</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// ...existing code...
import React, { useRef, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function CategoryModal({
  show,
  onHide,
  // mode: 'category' (default) shows single category input
  // mode: 'subcategory' shows parent category select + subcategory input
  mode = 'category',
  // category props (used when mode === 'category')
  categoryName = '',
  onCategoryChange = () => {},
  // subcategory props (used when mode === 'subcategory')
  categories = [], // array of { _id, name, subcategories? }
  parentCategoryId = '',
  onParentCategoryChange = () => {},
  subcategoryName = '',
  onSubcategoryChange = () => {},
  // single submit handler receives an object:
  // { type: 'category', name } or { type: 'subcategory', name, parentId }
  onSubmit = () => {}
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // focus the relevant input when modal opens / mode changes
    if (!show) return;
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [show, mode]);

  function handleSubmit() {
    if (mode === 'subcategory') {
      onSubmit({ type: 'subcategory', name: subcategoryName.trim(), parentId: parentCategoryId });
    } else {
      onSubmit({ type: 'category', name: categoryName.trim() });
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'subcategory' ? 'Add Subcategory' : 'Add Category'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode === 'subcategory' ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Parent Category</Form.Label>
              <Form.Select
                value={parentCategoryId}
                onChange={(e) => onParentCategoryChange(e.target.value)}
              >
                <option value="">Select parent category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subcategory Name</Form.Label>
              <Form.Control
                type="text"
                value={subcategoryName}
                ref={inputRef}
                onChange={(e) => onSubcategoryChange(e.target.value)}
                placeholder="Enter subcategory name"
              />
            </Form.Group>
          </>
        ) : (
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              ref={inputRef}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="Enter category name"
              autoFocus
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  ); 
}
// ...existing code...