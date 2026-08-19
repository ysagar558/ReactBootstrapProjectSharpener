import React from "react";
import { Container } from "react-bootstrap";
import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-page">
      <Container fluid>
        <h1>Welcome to Expense Tracker!!!</h1>
      </Container>
    </div>
  );
};

export default Welcome;