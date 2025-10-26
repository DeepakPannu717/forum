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
// import React from "react";
// import { Accordion, ListGroup } from "react-bootstrap";

// export default function Sidebar({ categories = [], onSelectCategory, onSelectTopic }) {
//   return (
//     <div className="p-3 bg-light" style={{ height: "100vh", overflowY: "auto" }}>
//       <h5>Categories</h5>

//       <Accordion>
//         {categories.map((category, idx) => (
//           <Accordion.Item eventKey={String(idx)} key={category._id || idx}>
//             <Accordion.Header
//               // call onSelectCategory when header is clicked (optional)
//               onClick={() => onSelectCategory && onSelectCategory(category)}
//             >
//               {category.name}
//             </Accordion.Header>

//             <Accordion.Body>
//               <ListGroup variant="flush">
//                 {(category.topics ?? []).length === 0 && (
//                   <ListGroup.Item className="text-muted">No topics</ListGroup.Item>
//                 )}

//                 {(category.topics ?? []).map((topic) => (
//                   <ListGroup.Item
//                     action
//                     key={topic._id}
//                     onClick={() => onSelectTopic && onSelectTopic(topic, category)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {topic.name}
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Accordion.Body>
//           </Accordion.Item>
//         ))}
//       </Accordion>
//     </div>
//   );
// }
// ...existing code...
// ...existing code...
import React, { useRef, useState, useEffect } from "react";
import { Accordion, ListGroup } from "react-bootstrap";

export default function Sidebar({ categories = [], onSelectCategory, onSelectTopic }) {
  const sidebarRef = useRef(null);
  const dragState = useRef({ startX: 0, startWidth: 0, dragging: false });
  const [width, setWidth] = useState(280); // default width
  const [expandedCategories, setExpandedCategories] = useState({});
  const minWidth = 80;
  const maxWidth = 800;

  useEffect(() => {
    function onMove(e) {
      if (!dragState.current.dragging) return;
      const dx = e.clientX - dragState.current.startX;
      const newW = Math.min(maxWidth, Math.max(minWidth, dragState.current.startWidth + dx));
      setWidth(newW);
    }
    function onUp() {
      dragState.current.dragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    if (dragState.current.dragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  function startDrag(e) {
    e.preventDefault();
    dragState.current = { dragging: true, startX: e.clientX, startWidth: width };
  }

  function measureAutoWidth() {
    // measure using canvas for accurate width using sidebar font
    const ctx = document.createElement("canvas").getContext("2d");
    const comp = sidebarRef.current ? window.getComputedStyle(sidebarRef.current) : null;
    ctx.font = comp ? `${comp.fontSize} ${comp.fontFamily}` : "16px Arial";

    let maxTextW = 0;
    const check = (s) => {
      if (!s) return;
      const m = ctx.measureText(s).width;
      if (m > maxTextW) maxTextW = m;
    };

    categories.forEach((c) => {
      check(c.name);
      (c.topics || []).forEach((t) => check(t.name));
    });

    // add padding + room for resizer
    const padding = 32; // left/right padding + icons
    const resizerSpace = 10;
    const target = Math.min(maxWidth, Math.max(minWidth, Math.ceil(maxTextW + padding + resizerSpace)));
    return target;
  }

  function autoFit() {
    const w = measureAutoWidth();
    setWidth(w);
  }

  return (
    <div
      ref={sidebarRef}
      className="p-6 bg-light"
      style={{
        height: "100vh",
        overflowY: "auto",
        width: width,
        minWidth: minWidth,
        maxWidth: maxWidth,
        transition: "width 200ms ease",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h5 style={{ margin: 0 }}>Categories</h5>
        <button
          title="Auto-fit width (double-click resizer)"
          onClick={autoFit}
          style={{
            border: "none",
            background: "transparent",
            padding: "4px 8px",
            cursor: "pointer",
            color: "#0d6efd",
          }}
        >
          Auto
        </button>
      </div>

      <Accordion>
        {categories.filter(cat => !cat.parentId).map((category, idx) => (
          <Accordion.Item 
            eventKey={String(idx)} 
            key={category._id || idx}
          >
            <Accordion.Header 
              onClick={() => onSelectCategory && onSelectCategory(category)}
            >
              {category.name}
            </Accordion.Header>

            <Accordion.Body className="p-0">
              {/* Category's own topics */}
              <ListGroup variant="flush">
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

              {/* Subcategories */}
              {(category.subcategories ?? []).map((subcat) => (
                <div key={subcat._id} className="ms-3 border-start">
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header 
                        onClick={() => onSelectCategory && onSelectCategory(subcat)}
                      >
                        {subcat.name}
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        <ListGroup variant="flush">
                          {(subcat.topics ?? []).length === 0 ? (
                            <ListGroup.Item className="text-muted">No topics</ListGroup.Item>
                          ) : (
                            subcat.topics.map((topic) => (
                              <ListGroup.Item
                                action
                                key={topic._id}
                                onClick={() => onSelectTopic && onSelectTopic(topic, subcat)}
                                style={{ cursor: "pointer" }}
                              >
                                {topic.name}
                              </ListGroup.Item>
                            ))
                          )}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              ))}

              {/* Show "No content" if no topics and no subcategories */}
              {(category.topics ?? []).length === 0 && (category.subcategories ?? []).length === 0 && (
                <ListGroup variant="flush">
                  <ListGroup.Item className="text-muted">No content</ListGroup.Item>
                </ListGroup>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* resizer bar */}
      <div
        onMouseDown={startDrag}
        onDoubleClick={autoFit}
        title="Drag to resize / double-click to auto-fit"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 8,
          height: "100%",
          cursor: "ew-resize",
          background: "transparent",
        }}
      >
        {/* visible handle */}
        <div
          style={{
            position: "absolute",
            right: 1,
            top: "50%",
            transform: "translateY(-50%)",
            width: 4,
            height: 40,
            background: "rgba(0,0,0,0.08)",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}
// ...existing code...