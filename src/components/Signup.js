import React, { useState } from "react";
import { Container, Navbar, Nav, Form, Button, Alert } from "react-bootstrap";
import {useHistory} from "react-router-dom";
import "./Signup.css";

const API_KEY = "AIzaSyB0e7Z_UOBldjUY0i1y3N4i8t_odTfBaog";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const history=useHistory();

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // 1. Check empty fields
  if (!email.trim() || !password || !confirmPassword) {
    setError("All fields are mandatory.");
    return;
  }

  // 2. Check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  // 3. Check password length
  if (password.length < 6) {
    setError("Password must contain at least 6 characters.");
    return;
  }

  // 4. Check password match
  if (password !== confirmPassword) {
    setError("Password and Confirm Password do not match.");
    return;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    console.log("Firebase response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Signup failed");
    }

    // Successful signup
    console.log("User has successfully signed up.");

    setSuccess("User has successfully signed up.");

    setEmail("");
    setPassword("");
    setConfirmPassword("");

  } catch (error) {
    console.log("Signup error:", error.message);

    switch (error.message) {

      case "EMAIL_EXISTS":
        setError("This email is already registered.");
        break;

      case "INVALID_EMAIL":
        setError("Please enter a valid email address.");
        break;

      case "WEAK_PASSWORD":
        setError("Password must contain at least 6 characters.");
        break;

      default:
        setError("Something went wrong. Please try again.");
    }
  }
};

  return (
    <div className="signup-page">

      {/* Blue Background Shape */}
      <div className="blue-shape"></div>

      {/* Navbar */}
      <Navbar className="custom-navbar" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/" className="brand">
            <span className="brand-logo">△</span>
            <span className="brand-name">MyWebLink</span>
          </Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Signup Form */}
      <Container className="signup-container">
        <div className="signup-card">

          <h2>SignUp</h2>

          {error && (
            <Alert variant="danger" className="signup-alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="signup-alert">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>

  <Form.Group className="mb-2">
    <Form.Control
      type="text"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-2">
    <Form.Control
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-4">
    <Form.Control
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
  </Form.Group>

  <Button
    type="submit"
    className="signup-button"
    // disabled={!email || !password || !confirmPassword}
  >
    Sign up
  </Button>

</Form>
        </div>

        {/* Login Button */}
        <Button
          className="login-button"
          variant="light"
          onClick={()=>history.push("/login")}
        >
          Have an account? Login
        </Button>
      </Container>
    </div>
  );
};

export default Signup;