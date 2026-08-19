import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../components/Login";


// Helper function
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};


describe("Login Component", () => {

  // Test 1
  test("renders email, password and login button", () => {
    renderLogin();

    expect(
      screen.getByPlaceholderText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Login" })
    ).toBeInTheDocument();
  });


  
  // Test 2
  test("shows error when email and password are empty", async () => {
    renderLogin();

    const loginButton = screen.getByRole("button", {
      name: "Login",
    });

    // Button is disabled, so directly submit the form
    const form = screen.getByRole("button", {
      name: "Login",
    }).closest("form");

    fireEvent.submit(form);

    expect(
      await screen.findByText(
        "Email and password are mandatory."
      )
    ).toBeInTheDocument();
  });


  // Test 3
  test("successfully logs in user and stores token in localStorage", async () => {

    // Mock Firebase response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            idToken: "fake-id-token",
            email: "test@gmail.com",
            localId: "user123",
          }),
      })
    );

    const localStorageSetItemSpy = jest.spyOn(
      Storage.prototype,
      "setItem"
    );

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText("Email"),
      {
        target: {
          value: "test@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("password"),
      {
        target: {
          value: "password123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login",
      })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      "token",
      "fake-id-token"
    );

    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      "email",
      "test@gmail.com"
    );

    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      "userId",
      "user123"
    );

    localStorageSetItemSpy.mockRestore();
    global.fetch.mockRestore();
  });


  // Test 4
  test("shows error when invalid login credentials are provided", async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: {
              message: "INVALID_LOGIN_CREDENTIALS",
            },
          }),
      })
    );

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText("Email"),
      {
        target: {
          value: "wrong@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("password"),
      {
        target: {
          value: "wrongpassword",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login",
      })
    );

    expect(
      await screen.findByText(
        "Invalid email or password."
      )
    ).toBeInTheDocument();

    global.fetch.mockRestore();
  });


  // Test 5
  test("password visibility can be toggled", () => {
    renderLogin();

    const passwordInput =
      screen.getByPlaceholderText("password");

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute(
      "type",
      "password"
    );

    const toggleButton = screen.getByRole("button", {
      name: "◉̸",
    });

    fireEvent.click(toggleButton);

    // Password should now be visible
    expect(passwordInput).toHaveAttribute(
      "type",
      "text"
    );
  });

});