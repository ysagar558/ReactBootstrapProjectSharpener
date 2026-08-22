import React, { useEffect, useState } from "react";
import {
    Container,
    Button,
    Card,
    Spinner,
    Alert,
} from "react-bootstrap";

import {
    useParams,
    useHistory,
} from "react-router-dom";

const FIREBASE_DATABASE_URL =
    "https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com";

const MailDetails = () => {
    const [mail, setMail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { folder, mailId } = useParams();
    const history = useHistory();

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const formatEmail = (email) => {
        return email
            .trim()
            .toLowerCase()
            .replace(/[.#$[\]@]/g, "_");
    };

    useEffect(() => {
        const getMail = async () => {
            try {
                if (!email) {
                    throw new Error("User email not found.");
                }

                const formattedEmail = formatEmail(email);

                const response = await fetch(
                    `${FIREBASE_DATABASE_URL}/mails/${folder}/${formattedEmail}/${mailId}.json?auth=${token}`
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch mail.");
                }

                const data = await response.json();

                if (!data) {
                    throw new Error("Mail not found.");
                }

                setMail(data);

                // Mark mail as read
                if (data.read === false) {
                    await fetch(
                        `${FIREBASE_DATABASE_URL}/mails/${folder}/${formattedEmail}/${mailId}.json?auth=${token}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                read: true,
                            }),
                        }
                    );

                    setMail((previousMail) => ({
                        ...previousMail,
                        read: true,
                    }));
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getMail();
    }, [folder, mailId]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                </Alert>

                <Button onClick={() => history.goBack()}>
                    Back
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Button
                variant="light"
                className="mb-4"
                onClick={() => history.goBack()}
            >
                ← Back
            </Button>

            <Card>
                <Card.Body>
                    <h3 className="mb-4">
                        {mail.subject}
                    </h3>

                    <hr />

                    <div className="mb-3">
                        <strong>From:</strong>{" "}
                        {mail.from}
                    </div>

                    <div className="mb-3">
                        <strong>To:</strong>{" "}
                        {mail.to}
                    </div>

                    <div className="mb-3">
                        <strong>Date:</strong>{" "}
                        {mail.createdAt &&
                            new Date(
                                mail.createdAt
                            ).toLocaleString()}
                    </div>

                    <hr />

                    <div className="mail-full-message">
                        {mail.bodyPreview}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MailDetails;