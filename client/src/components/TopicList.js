import React, { useState } from 'react';
import { Table, Modal, Button, Pagination, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import Prism from 'prismjs';
import TopicModal from './modals/TopicModal';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';

export default function TopicList({ categories, onSelectTopic }) {
  // Helper function to recursively collect all topics from categories and subcategories
  const collectAllTopics = (cats) => {
    const allTopics = [];
    const recurse = (cat, parentCat = null) => {
      if (cat.topics) {
        cat.topics.forEach(topic => {
          allTopics.push({
            ...topic,
            categoryName: parentCat ? `${parentCat.name} > ${cat.name}` : cat.name,
            category: {
              ...cat,
              parentId: parentCat ? parentCat._id : null
            }
          });
        });
      }
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => recurse(sub, cat));
      }
    };
    cats.forEach(cat => recurse(cat));
    return allTopics;
  };

  const allTopics = collectAllTopics(categories);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');

  // Get subcategories for the selected category
  const getSubcategories = (catId) => {
    if (catId === 'all') return [];
    const category = categories.find(c => c._id === catId);
    if (!category) return [];
    
    const subs = [];
    if (category.subcategories) {
      category.subcategories.forEach(sub => {
        subs.push(sub);
        // If subcategory has its own subcategories, add them too
        if (sub.subcategories) {
          sub.subcategories.forEach(subsub => {
            subs.push(subsub);
          });
        }
      });
    }
    return subs;
  };

  const openTopicModal = (topic, isEdit = false) => {
    setActiveTopic(topic);
    if (isEdit) {
      setShowEditModal(true);
    } else {
      setShowViewModal(true);
    }
  };

  const closeTopicModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setActiveTopic(null);
  };

  const highlightCode = (code, language = 'javascript') => {
    try {
      return Prism.highlight(
        code || '',
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
    } catch (e) {
      return code || '';
    }
  };

  const handleEditSuccess = (updatedTopic) => {
    // You'll need to implement a way to refresh the topics list
    // This might involve lifting the state up to the parent component
    // For now, we'll just close the modal
    setShowEditModal(false);
    setActiveTopic(null);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Topics List</h4>
        <Button variant="primary" onClick={() => setShowEditModal(true)}>
          Add New Topic
        </Button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2" style={{ flex: 1 }}>
          <div style={{ minWidth: 240 }}>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setSubcategoryFilter('all'); setCurrentPage(1); }}
            >
              <option value="all">All Categories</option>
              {(categories || []).map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Form.Select>
          </div>
          {categoryFilter !== 'all' && getSubcategories(categoryFilter).length > 0 && (
            <div style={{ minWidth: 200 }}>
              <Form.Select
                value={subcategoryFilter}
                onChange={(e) => { setSubcategoryFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Subcategories</option>
                {getSubcategories(categoryFilter).map((sub) => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </Form.Select>
            </div>
          )}
          <Form.Control
            type="text"
            placeholder="Search topics..."
            value={nameFilter}
            onChange={(e) => { setNameFilter(e.target.value); setCurrentPage(1); }}
            style={{ maxWidth: 300 }}
          />
        </div>

        <Form.Select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          style={{ width: 120 }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Topic</th>
            <th>Status</th>
            <th>Language</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            // Apply category, subcategory, and name filters
            const filtered = allTopics.filter(topic => {
              const matchesCategory = categoryFilter === 'all' || 
                (topic.category && (
                  topic.category._id === categoryFilter || 
                  (topic.category.parentId === categoryFilter)
                ));
                
              const matchesSubcategory = subcategoryFilter === 'all' || 
                (topic.category && topic.category._id === subcategoryFilter);
                
              const matchesName = !nameFilter || 
                topic.name.toLowerCase().includes(nameFilter.toLowerCase());
                
              return matchesCategory && matchesSubcategory && matchesName;
            });
            const total = filtered.length;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            const current = Math.min(currentPage, totalPages);
            const start = (current - 1) * pageSize;
            const paged = filtered.slice(start, start + pageSize);

            return paged.map((topic, idx) => (
              <tr key={topic._id} className="topic-row">
                <td>{start + idx + 1}</td>
                <td>{topic.categoryName}</td>
                <td>
                  <span 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => openTopicModal(topic)}
                  >
                    {topic.name}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${topic.status === 'active' ? 'success' : 'secondary'}`}>
                    {topic.status || 'active'}
                  </span>
                </td>
                <td>{topic.language || 'javascript'}</td>
                <td>{topic.createdAt ? format(new Date(topic.createdAt), 'MMM dd, yyyy') : '-'}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTopicModal(topic, true);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ));
          })()}
        </tbody>
      </Table>

      {/* Pagination controls */}
      {(() => {
        // Apply category, subcategory, and name filters
        const filtered = allTopics.filter(topic => {
          const matchesCategory = categoryFilter === 'all' || 
            (topic.category && (
              topic.category._id === categoryFilter || 
              (topic.category.parentId === categoryFilter)
            ));
            
          const matchesSubcategory = subcategoryFilter === 'all' || 
            (topic.category && topic.category._id === subcategoryFilter);
            
          const matchesName = !nameFilter || 
            topic.name.toLowerCase().includes(nameFilter.toLowerCase());
            
          return matchesCategory && matchesSubcategory && matchesName;
        });
        const total = filtered.length;
        if (total <= pageSize) return null;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const current = Math.min(currentPage, totalPages);

        // build visible page range (window)
        const pages = [];
        const delta = 2; // show current +/- 2
        let left = Math.max(1, current - delta);
        let right = Math.min(totalPages, current + delta);

        if (current - delta <= 2) left = 1;
        if (current + delta >= totalPages - 1) right = totalPages;

        if (left > 1) {
          pages.push(1);
          if (left > 2) pages.push('left-ellipsis');
        }

        for (let p = left; p <= right; p++) pages.push(p);

        if (right < totalPages) {
          if (right < totalPages - 1) pages.push('right-ellipsis');
          pages.push(totalPages);
        }

        return (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(current - 1) * pageSize + 1} - {Math.min(current * pageSize, total)} of {total}
            </div>
            <Pagination className="mb-0">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={current === 1} />
              <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={current === 1} />
              {pages.map((p, i) => (
                p === 'left-ellipsis' || p === 'right-ellipsis' ? (
                  <Pagination.Ellipsis key={`e-${i}`} disabled />
                ) : (
                  <Pagination.Item key={p} active={p === current} onClick={() => setCurrentPage(p)}>{p}</Pagination.Item>
                )
              ))}
              <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={current === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={current === totalPages} />
            </Pagination>
          </div>
        );
      })()}

      {/* Topic details modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{activeTopic ? activeTopic.name : 'Topic'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '700px', overflowY: 'auto' }}>
          {activeTopic && (
            <div>
              <div className="mb-2 text-muted">
                <strong>Category:</strong> {activeTopic.categoryName} &nbsp; • &nbsp;
                <strong>Language:</strong> {activeTopic.language || 'javascript'} &nbsp; • &nbsp;
                <strong>Status:</strong> {activeTopic.status || 'active'} &nbsp; • &nbsp;
                <strong>Created:</strong> {activeTopic.createdAt ? format(new Date(activeTopic.createdAt), 'PPP') : '-'}
              </div>

              <h6>Code</h6>
              <pre
                className={`border rounded p-3 language-${(activeTopic.language || 'javascript')}`}
                style={{ background: '#2d2d2d', color: '#eee', overflowX: 'auto', overflowY: 'auto', maxHeight: '500px', whiteSpace: 'pre' }}
                dangerouslySetInnerHTML={{ __html: highlightCode(activeTopic.codebase || '', (activeTopic.language || 'javascript')) }}
              />

              {activeTopic.output && (
                <div className="mt-3">
                  <h6>Output</h6>
                  <pre className="p-3 bg-light border rounded" style={{ maxHeight: 200, overflow: 'auto' }}>{activeTopic.output}</pre>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTopicModal}>Close</Button>
          <Button variant="primary" onClick={() => { if (onSelectTopic && activeTopic) { onSelectTopic(activeTopic, activeTopic.category); } closeTopicModal(); }}>
            Open in viewer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Topic Modal */}
      <TopicModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        categories={categories}
        onSuccess={handleEditSuccess}
        topic={showEditModal ? activeTopic : null}
      />
    </div>
  );
}