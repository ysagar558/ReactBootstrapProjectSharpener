import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";

import Sent from "../components/Sent";

const renderSent = () => {
    return render(
        <BrowserRouter>
            <Sent />
        </BrowserRouter>
    );
};

describe("Sent Component", () => {
    beforeEach(() => {
        localStorage.setItem(
            "email",
            "test@gmail.com"
        );

        localStorage.setItem(
            "token",
            "test-token"
        );

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    // Test Case 1
    test("shows blue dot for unread mail", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                mail1: {
                    to: "receiver@gmail.com",
                    subject: "Unread Mail",
                    bodyPreview: "This is an unread mail",
                    createdAt: "2026-08-21T10:00:00.000Z",
                    read: false,
                },
            }),
        });

        renderSent();

        // await screen.findByText("Unread Mail");

        // expect(
        //     screen.getByText("●")
        // ).toBeInTheDocument();
        expect(
            await screen.findByTestId("blue-dot-mail1")
        ).toBeInTheDocument();
    });

    // Test Case 2
    test("does not show blue dot for read mail", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                mail1: {
                    to: "receiver@gmail.com",
                    subject: "Read Mail",
                    bodyPreview: "This mail has been read",
                    createdAt: "2026-08-21T10:00:00.000Z",
                    read: true,
                },
            }),
        });

        renderSent();

        // await screen.findByText("Read Mail");

        // expect(
        //     screen.queryByText("●")
        // ).not.toBeInTheDocument();

        expect(
            screen.queryByTestId("blue-dot-mail1")
        ).not.toBeInTheDocument();
    });

    // Test Case 3
    test("shows correct unread count beside Sent", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                mail1: {
                    to: "user1@gmail.com",
                    subject: "Unread Mail 1",
                    bodyPreview: "Message 1",
                    createdAt: "2026-08-21T10:00:00.000Z",
                    read: false,
                },

                mail2: {
                    to: "user2@gmail.com",
                    subject: "Unread Mail 2",
                    bodyPreview: "Message 2",
                    createdAt: "2026-08-21T11:00:00.000Z",
                    read: false,
                },

                mail3: {
                    to: "user3@gmail.com",
                    subject: "Read Mail",
                    bodyPreview: "Message 3",
                    createdAt: "2026-08-21T12:00:00.000Z",
                    read: true,
                },
            }),
        });

        renderSent();

        await screen.findByText("Unread Mail 1");

        expect(
            screen.getByText("2")
        ).toBeInTheDocument();
    });
});