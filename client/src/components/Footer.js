// src/components/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-4">
      <Container>
        &copy; {new Date().getFullYear()} Forum App
      </Container>
    </footer>
  );
}
