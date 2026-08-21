import React from "react";
import {
    render,
    screen,
    fireEvent,
} from "@testing-library/react";

import ComposeMail from "../components/ComposeMail";

// Mock only react-draft-wysiwyg
jest.mock("react-draft-wysiwyg", () => ({
    Editor: () => (
        <div data-testid="editor">
            Editor
        </div>
    ),
}));

describe("ComposeMail Component", () => {

    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            "email",
            "sender@gmail.com"
        );

        localStorage.setItem(
            "token",
            "fake-token"
        );
    });


    // Test 1
    test("renders Compose Mail component", () => {

        render(<ComposeMail />);

        expect(
            screen.getByText("Compose Mail")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("To")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Subject")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Send",
            })
        ).toBeInTheDocument();

    });


    // Test 2
    test("receiver email input changes", () => {

        render(<ComposeMail />);

        const emailInput =
            screen.getByPlaceholderText("To");

        fireEvent.change(emailInput, {
            target: {
                value: "receiver@gmail.com",
            },
        });

        expect(emailInput.value).toBe(
            "receiver@gmail.com"
        );

    });


    // Test 3
    test("subject input changes", () => {

        render(<ComposeMail />);

        const subjectInput =
            screen.getByPlaceholderText("Subject");

        fireEvent.change(subjectInput, {
            target: {
                value: "Test Subject",
            },
        });

        expect(subjectInput.value).toBe(
            "Test Subject"
        );

    });


    // Test 4
    test("shows error when receiver email is empty", () => {

        render(<ComposeMail />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Send",
            })
        );

        expect(
            screen.getByText(
                "Receiver email is required."
            )
        ).toBeInTheDocument();

    });


    // Test 5
    test("shows error when subject is empty", () => {

        render(<ComposeMail />);

        fireEvent.change(
            screen.getByPlaceholderText("To"),
            {
                target: {
                    value: "receiver@gmail.com",
                },
            }
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Send",
            })
        );

        expect(
            screen.getByText(
                "Subject is required."
            )
        ).toBeInTheDocument();

    });

});