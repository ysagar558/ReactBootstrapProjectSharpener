import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";

import ComposeMail from "./ComposeMail";

const FIREBASE_DATABASE_URL =
  "https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com";



const Inbox = (props) => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showCompose, setShowCompose] = useState(false);

  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const history = useHistory();

  // Use the SAME formatting function as ComposeMail
  const formatEmail = (email) => {
    return email
      .trim()
      .toLowerCase()
      .replace(/[.#$[\]@]/g, "_");
  };

  const unreadCount = mails.filter(
    (mail) => mail.read === false
  ).length;

  const sentUnreadCount = localStorage.getItem("unreadcount");

  const getMails = async () => {
    if (!userEmail) {
      setError("User email not found. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedEmail = formatEmail(userEmail);

      const response = await fetch(
        `${FIREBASE_DATABASE_URL}/mails/inbox/${formattedEmail}.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch mails.");
      }

      const data = await response.json();

      if (!data) {
        setMails([]);
        return;
      }

      const loadedMails = Object.entries(data).map(
        ([id, mail]) => ({
          id,
          ...mail,
        })
      );

      // Latest mail first
      loadedMails.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setMails(loadedMails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMails();
  }, []);

  // Show ComposeMail when Compose is clicked
  if (showCompose) {
    return (
      <Container fluid>
        <Row>
          <Col md={2} className="p-3 border-end">
            <Button
              variant="primary"
              className="w-100"
              onClick={() => {
                setShowCompose(false);
                getMails();
              }}
            >
              Inbox
            </Button>
          </Col>

          <Col md={10}>
            <ComposeMail />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="min-vh-100 border-end p-3"
        >
          <Button
            variant="primary"
            className="w-100 mb-3"
            onClick={() => setShowCompose(true)}
          >
            Compose
          </Button>

          <ListGroup variant="flush">
            <ListGroup.Item active>
              <span>Inbox</span>

              {unreadCount>0 && (<Badge bg="secondary" pill>
                {unreadCount}
              </Badge>)}
            </ListGroup.Item>

            <ListGroup.Item action>
              Unread
            </ListGroup.Item>

            <ListGroup.Item action>
              Starred
            </ListGroup.Item>

            <ListGroup.Item action onClick={() => { history.push("/sent") }}>
              <span>Sent</span>

              {sentUnreadCount > 0 && (
                <Badge bg="secondary" pill>
                  {sentUnreadCount}
                </Badge>
              )}


            </ListGroup.Item>

            <ListGroup.Item action>
              Archive
            </ListGroup.Item>

            <ListGroup.Item action>
              Spam
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Mail Area */}
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Inbox</h2>

            <Button
              variant="outline-primary"
              onClick={getMails}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {loading && (
            <div className="text-center mt-5">
              <Spinner animation="border" />
            </div>
          )}

          {!loading && mails.length === 0 && (
            <Alert variant="secondary">
              No mails found.
            </Alert>
          )}

          {!loading && mails.length > 0 && (
            <ListGroup>
              {mails.map((mail) => (
                <ListGroup.Item
                  key={mail.id}
                  className="mb-1"
                >
                  <Row>
                    <Col md={3}>
                      <strong>
                        {mail.from}
                      </strong>
                    </Col>

                    <Col md={7}>
                      <strong>
                        {mail.subject}
                      </strong>

                      <span className="ms-2 text-muted">
                        {mail.bodyPreview}
                      </span>
                    </Col>

                    <Col
                      md={2}
                      className="text-end text-muted"
                    >
                      {mail.createdAt
                        ? new Date(
                          mail.createdAt
                        ).toLocaleString()
                        : ""}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Inbox;