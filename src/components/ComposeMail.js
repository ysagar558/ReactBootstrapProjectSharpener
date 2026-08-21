import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const FIREBASE_DATABASE_URL =
    "https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com";

const ComposeMail = () => {
    const [receiverEmail, setReceiverEmail] = useState("");
    const [subject, setSubject] = useState("");

    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const senderEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    // IMPORTANT:
    // Use this same function in ComposeMail and Inbox

    const formatEmail = (email) => {
        return email
            .trim()
            .toLowerCase()
            .replace(/[.#$[\]@]/g, "_");
    };


    // const formatEmail = (email) => {
    //     return email.replace(/[.#$[\]@]/g, "_");
    // };

    const handleSendMail = async () => {
        setError("");
        setMessage("");

        const plainText = editorState
            .getCurrentContent()
            .getPlainText()
            .trim();

        if (!receiverEmail.trim()) {
            setError("Receiver email is required.");
            return;
        }

        if (!subject.trim()) {
            setError("Subject is required.");
            return;
        }

        if (!plainText) {
            setError("Message cannot be empty.");
            return;
        }

        if (!senderEmail) {
            setError("Sender email not found. Please login again.");
            return;
        }

        try {
            const formattedReceiverEmail = formatEmail(
                receiverEmail.trim().toLowerCase()
            );

            const formattedSenderEmail = formatEmail(
                senderEmail.trim().toLowerCase()
            );

            const mailData = {
                from: senderEmail,
                to: receiverEmail,
                subject: subject,

                body: convertToRaw(
                    editorState.getCurrentContent()
                ),

                bodyPreview: plainText,

                createdAt: new Date().toISOString(),

                read: false,
            };

            console.log("Sender:", senderEmail);
            console.log("Receiver:", receiverEmail);
            console.log(
                "Receiver Firebase Key:",
                formattedReceiverEmail
            );

            // Store in receiver inbox
            const inboxResponse = await fetch(
                `${FIREBASE_DATABASE_URL}/mails/inbox/${formattedReceiverEmail}.json?auth=${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(mailData),
                }
            );

            if (!inboxResponse.ok) {
                const errorData = await inboxResponse.json();

                console.log("Inbox error:", errorData);

                throw new Error(
                    errorData.error || "Unable to send mail."
                );
            }

            // Store in sender sent box
            const sentResponse = await fetch(
                `${FIREBASE_DATABASE_URL}/mails/sent/${formattedSenderEmail}.json?auth=${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(mailData),
                }
            );

            if (!sentResponse.ok) {
                throw new Error(
                    "Mail sent but could not be saved in sent box."
                );
            }

            console.log("Mail successfully sent");

            setMessage("Mail sent successfully!");

            setReceiverEmail("");
            setSubject("");
            setEditorState(EditorState.createEmpty());

        } catch (error) {
            console.log("Mail error:", error);

            setError(error.message);
        }
    };

    return (
        <Container className="mt-4">

            <h2>Compose Mail</h2>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            {message && (
                <Alert variant="success">
                    {message}
                </Alert>
            )}

            <Form>

                <Form.Group className="mb-3">

                    <Form.Control
                        type="email"
                        placeholder="To"
                        value={receiverEmail}
                        onChange={(e) =>
                            setReceiverEmail(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Control
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) =>
                            setSubject(e.target.value)
                        }
                    />

                </Form.Group>

                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    placeholder="Write your message..."
                />

                <Button
                    className="mt-3"
                    onClick={handleSendMail}
                >
                    Send
                </Button>

            </Form>

        </Container>
    );
};

export default ComposeMail;