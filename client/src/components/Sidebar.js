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
import React from "react";
import { ListGroup } from "react-bootstrap";

export default function Sidebar({ categories, onSelectCategory, onSelectTopic }) {
  return (
    <div className="p-3 bg-light" style={{ height: "100vh", overflowY: "auto" }}>
      <h5>Categories</h5>
      <ListGroup>
        {categories.map((category) => (
          <ListGroup.Item key={category._id} className="mb-2">
            <div
              onClick={() => onSelectCategory(category)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {category.name}
            </div>
            <ul style={{ paddingLeft: "15px", marginTop: "5px" }}>
              {(category.topics ?? []).map((topic) => (
                <li key={topic._id} style={{ fontSize: "0.9em" }}>
                  <a
                    href="#!"
                    onClick={() => onSelectTopic(topic, category)}
                    style={{ textDecoration: "none" }}
                  >
                    {topic.name}
                  </a>
                </li>
              ))}
            </ul>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
