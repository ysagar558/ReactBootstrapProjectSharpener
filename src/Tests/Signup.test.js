import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../components/Signup";

describe("Signup Component", () => {

  // Test 1
  test("renders email, password and confirm password fields", () => {
    render(<Signup />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirm Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Sign up" })
    ).toBeInTheDocument();
  });


  // Test 2
  test("shows error when passwords do not match", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Confirm Password"),
      {
        target: { value: "password456" },
      }
    );

    const signupButton = screen.getByRole("button", {
      name: "Sign up",
    });

    fireEvent.click(signupButton);

    expect(
      await screen.findByText(
        "Password and Confirm Password do not match."
      )
    ).toBeInTheDocument();
  });


  // Test 3
  test("shows error when password is less than 6 characters", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "12345" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Confirm Password"),
      {
        target: { value: "12345" },
      }
    );

    const signupButton = screen.getByRole("button", {
      name: "Sign up",
    });

    fireEvent.click(signupButton);

    expect(
      await screen.findByText(
        "Password must contain at least 6 characters."
      )
    ).toBeInTheDocument();
  });


  // Test 4
  test("successfully creates a new user", async () => {

    // Mock Firebase API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            idToken: "fake-id-token",
            email: "test@gmail.com",
            localId: "12345",
          }),
      })
    );

    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Confirm Password"),
      {
        target: { value: "password123" },
      }
    );

    const signupButton = screen.getByRole("button", {
      name: "Sign up",
    });

    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(
        screen.getByText("User has successfully signed up.")
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "User has successfully signed up."
    );

    consoleSpy.mockRestore();
    global.fetch.mockRestore();
  });


  // Test 5
  test("shows error when email already exists", async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: {
              message: "EMAIL_EXISTS",
            },
          }),
      })
    );

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "existing@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Confirm Password"),
      {
        target: { value: "password123" },
      }
    );

    const signupButton = screen.getByRole("button", {
      name: "Sign up",
    });

    fireEvent.click(signupButton);

    expect(
      await screen.findByText(
        "This email is already registered."
      )
    ).toBeInTheDocument();

    global.fetch.mockRestore();
  });

});