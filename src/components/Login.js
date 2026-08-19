import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./Login.css";

const API_KEY = "AIzaSyB0e7Z_UOBldjUY0i1y3N4i8t_odTfBaog";

const Login = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check fields
    if (!email.trim() || !password) {
      setError("Email and password are mandatory.");
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
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

      console.log("Firebase login response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      // Successful login
      console.log("User has successfully logged in.");
      localStorage.setItem("token", data.idToken);

      // Navigate to Welcome page
      history.push("/welcome");

    } catch (error) {
      console.log("Login error:", error.message);

      switch (error.message) {
        case "EMAIL_NOT_FOUND":
          setError("User does not exist. Please sign up first.");
          break;

        case "INVALID_PASSWORD":
          setError("Incorrect password.");
          break;

        case "INVALID_LOGIN_CREDENTIALS":
          setError("Invalid email or password.");
          break;

        case "USER_DISABLED":
          setError("This user account has been disabled.");
          break;

        default:
          setError("Invalid email or password.");
      }
    }
  };

  return (
    <div className="login-page">

      {/* Blue background */}
      <div className="login-blue-shape"></div>

      <Container className="login-container">

        <div className="login-card">

          <h2>Login</h2>

          {error && (
            <Alert variant="danger" className="login-alert">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="password-group mb-3">

              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "◉" : "◉̸"}
              </button>

            </Form.Group>

            {/* Login */}
            <Button
              type="submit"
              className="login-submit-button"
            //   disabled={!email && !password}
            >
              Login
            </Button>

          </Form>

          {/* Forgot password */}
          <a
            href="/forgot-password"
            className="forgot-password"
          >
            Forgot password
          </a>

        </div>

        {/* Signup */}
        <Button
          variant="light"
          className="signup-redirect-button"
          onClick={() => history.push("/signup")}
        >
          Don't have an account? Sign up
        </Button>

      </Container>
    </div>
  );
};

export default Login;