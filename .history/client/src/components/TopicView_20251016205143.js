import React from 'react';
import { Card } from 'react-bootstrap';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

export default function TopicView({ topic }) {
  if (!topic) return null;

  const highlightCode = (code, language) => {
    if (!code) return '';
    try {
      return Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
    } catch (error) {
      return code;
    }
  };

  return (
    <Card className="h-100">
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