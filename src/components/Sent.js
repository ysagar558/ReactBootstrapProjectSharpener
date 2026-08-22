import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./Mail.css";

const FIREBASE_DATABASE_URL =
  "https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com";

const Sent = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const history = useHistory();

  const senderEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const formatEmail = (email) => {
    return email
      .trim()
      .toLowerCase()
      .replace(/[.#$[\]@]/g, "_");
  };

  const getSentMails = async () => {
    if (!senderEmail) {
      setError("User email not found.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedEmail = formatEmail(senderEmail);

      const response = await fetch(
        `${FIREBASE_DATABASE_URL}/mails/sent/${formattedEmail}.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch sent mails.");
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

      loadedMails.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMails(loadedMails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSentMails();
  }, []);

  // Count unread mails
  const unreadCount = mails.filter(
    (mail) => mail.read === false
  ).length;

  localStorage.setItem("unreadcount",unreadCount);

  const openMail = (mail) => {
    history.push(`/mail/sent/${mail.id}`);
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar p-3">
          <Button
            className="w-100 mb-3"
            onClick={() => history.push("/compose")}
          >
            Compose
          </Button>

          <div
            className="sidebar-item"
            onClick={() => history.push("/welcome")}
          >
            <span>Inbox</span>
          </div>

          <div
            className="sidebar-item"
          >
            <span>Unread</span>
          </div>

          <div
            className="sidebar-item"
          >
            <span>Starred</span>
          </div>

          <div
            className="sidebar-item active-sidebar"
            onClick={() => history.push("/sent")}
          >
            <span>Sent</span>

            {unreadCount > 0 && (
            <Badge bg="secondary" pill>
                {unreadCount}
              </Badge>
            )}
          </div>

          <div className="sidebar-item">
            Archive
          </div>

          <div className="sidebar-item">
            Spam
          </div>

          <div className="sidebar-item">
            Drafts
          </div>

          
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Sent</h2>

            <Button
              variant="outline-primary"
              onClick={getSentMails}
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
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}

          {!loading && mails.length === 0 && (
            <Alert variant="secondary">
              No sent mails found.
            </Alert>
          )}

          {!loading &&
            mails.map((mail) => (
              <div
                key={mail.id}
                className="mail-row"
                onClick={() => openMail(mail)}
              >
                <input
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Blue dot */}
                {!mail.read && (
                  <span className="blue-dot">
                    ●
                  </span>
                )}

                <div className="mail-sender text-truncate">
                  {mail.to}
                </div>

                <div className="mail-subject text-truncate">
                  {mail.subject}
                </div>

                <div className="mail-preview text-truncate">
                  {mail.bodyPreview}
                </div>

                <div className="mail-date">
                  {mail.createdAt
                    ? new Date(
                      mail.createdAt
                    ).toLocaleDateString()
                    : ""}
                </div>
              </div>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Sent;