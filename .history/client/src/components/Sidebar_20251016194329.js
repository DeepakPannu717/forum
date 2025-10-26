// // src/components/Sidebar.js
// import React from "react";
// import { ListGroup } from "react-bootstrap";

// export default function Sidebar({ categories, onSelectCategory }) {
//   return (
//     <div>
//       <h5>Categories</h5>
//       <ListGroup>
//         {categories.map((cat) => (
//           <ListGroup.Item
//             action
//             key={cat._id}
//             onClick={() => onSelectCategory(cat)}
//           >
//             {cat.name}
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </div>
//   );
// }


// src/components/Sidebar.js
// ...existing code...
import React from "react";
import { Accordion, ListGroup } from "react-bootstrap";

export default function Sidebar({ categories = [], onSelectCategory, onSelectTopic }) {
  return (
    <div className="p-3 bg-light" style={{ height: "100vh", overflowY: "auto" }}>
      <h5>Categories</h5>

      <Accordion>
        {categories.map((category, idx) => (
          <Accordion.Item eventKey={String(idx)} key={category._id || idx}>
            <Accordion.Header
              // call onSelectCategory when header is clicked (optional)
              onClick={() => onSelectCategory && onSelectCategory(category)}
            >
              {category.name}
            </Accordion.Header>

            <Accordion.Body>
              <ListGroup variant="flush">
                {(category.topics ?? []).length === 0 && (
                  <ListGroup.Item className="text-muted">No topics</ListGroup.Item>
                )}

                {(category.topics ?? []).map((topic) => (
                  <ListGroup.Item
                    action
                    key={topic._id}
                    onClick={() => onSelectTopic && onSelectTopic(topic, category)}
                    style={{ cursor: "pointer" }}
                  >
                    {topic.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
// ...existing code...
