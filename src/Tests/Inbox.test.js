import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Inbox from "../components/Inbox";

const renderInbox = () => {
    return render(
        <BrowserRouter>
            <Inbox />
        </BrowserRouter>
    );
};

describe("Inbox Component", () => {
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
    test("renders Inbox heading", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => null,
        });

        renderInbox();

        expect(
            screen.getByRole("heading", { name: "Inbox" })
        ).toBeInTheDocument();
    });

    // Test Case 2
    test("shows No mails found when inbox is empty", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => null,
        });

        renderInbox();

        expect(
            await screen.findByText("No mails found.")
        ).toBeInTheDocument();
    });

    // Test Case 3
    test("displays received mails", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                mail1: {
                    from: "sender@gmail.com",
                    to: "test@gmail.com",
                    subject: "Test Subject",
                    bodyPreview: "This is a test mail",
                    createdAt: "2026-08-21T10:00:00.000Z",
                },
            }),
        });

        renderInbox();

        expect(
            await screen.findByText("sender@gmail.com")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Test Subject")
        ).toBeInTheDocument();

        expect(
            screen.getByText("This is a test mail")
        ).toBeInTheDocument();
    });

    // Test Case 4
    test("shows error when API request fails", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        renderInbox();

        expect(
            await screen.findByText("Unable to fetch mails.")
        ).toBeInTheDocument();
    });

    // Test Case 5
    test("calls Firebase API when component loads", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => null,
        });

        renderInbox();

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });
    });
});