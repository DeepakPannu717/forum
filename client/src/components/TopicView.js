import React from 'react';
import { Card } from 'react-bootstrap';
import { highlightCode } from '../utils/codeHighlight';

export default function TopicView({ topic }) {
  if (!topic) return null;

  return (
    <Card className="custom-topic-view">
      <Card.Header>
        <h4>{topic.name}</h4>
      </Card.Header>
      <Card.Body>
        {topic.codebase && (
          <div className="mb-3">
            <h5>Code:</h5>
            <pre className="rounded">
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightCode(topic.codebase, topic.language || 'javascript')
                }}
              />
            </pre>
          </div>
        )}
        {topic.output && (
          <div>
            <h5>Output:</h5>
            <pre className="bg-light p-3 rounded">{topic.output}</pre>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="text-muted">
        Status: {topic.status || 'active'}
      </Card.Footer>
    </Card>
  );
}