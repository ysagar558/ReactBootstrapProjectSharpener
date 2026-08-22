import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import MailDetails from "../components/MailDetails";

const renderMailDetails = () => {
    return render(
        <MemoryRouter initialEntries={["/mail/inbox/mail1"]}>
            <Route path="/mail/:folder/:mailId">
                <MailDetails />
            </Route>
        </MemoryRouter>
    );
};

describe("MailDetails Component", () => {
    beforeEach(() => {
        localStorage.setItem("email", "test@gmail.com");
        localStorage.setItem("token", "test-token");

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    // Test Case 1
    test("renders complete mail details successfully", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                from: "sender@gmail.com",
                to: "test@gmail.com",
                subject: "Test Subject",
                bodyPreview: "This is the complete test message",
                createdAt: "2026-08-21T10:00:00.000Z",
                read: true,
            }),
        });

        renderMailDetails();

        expect(
            await screen.findByText("Test Subject")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/sender@gmail.com/)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "This is the complete test message"
            )
        ).toBeInTheDocument();
    });

    // Test Case 2
    test("shows error when mail is not found", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => null,
        });

        renderMailDetails();

        expect(
            await screen.findByText("Mail not found.")
        ).toBeInTheDocument();
    });

    // Test Case 3
    test("marks unread mail as read", async () => {
        fetch
            // First fetch: GET mail
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    from: "sender@gmail.com",
                    to: "test@gmail.com",
                    subject: "Unread Mail",
                    bodyPreview: "This mail was unread",
                    createdAt: "2026-08-21T10:00:00.000Z",
                    read: false,
                }),
            })

            // Second fetch: PATCH read: true
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

        renderMailDetails();

        await screen.findByText("Unread Mail");

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        expect(fetch.mock.calls[1][1]).toEqual(
            expect.objectContaining({
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    read: true,
                }),
            })
        );
    });
});