import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Inbox from "./Inbox";
import ComposeMail from "./ComposeMail";
import "./Sent.css";

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
      setError("User email not found. Please login again.");
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
    getSentMails();
  }, []);

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="min-vh-100 border-end p-3"
        >
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
            Inbox
          </div>

          <div className="sidebar-item">
            Unread
          </div>

          <div className="sidebar-item">
            Starred
          </div>

          <div
            className="sidebar-item active-sidebar"
          >
            Sent
          </div>

          <div className="sidebar-item">
            Archive
          </div>

          <div className="sidebar-item">
            Spam
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-3">
          <div className="d-flex justify-content-between mb-3">
            <h4>Sent</h4>

            <Button
              variant="outline-primary"
              size="sm"
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
            <div className="text-center mt-5">
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
                className="mail-row"
                key={mail.id}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="mail-checkbox"
                />

                {/* Unread dot / icon */}
                <span className="mail-dot">
                  ●
                </span>

                {/* Receiver */}
                <div className="mail-receiver text-truncate">
                  {mail.to}
                </div>

                {/* Subject */}
                <div className="mail-subject text-truncate">
                  {mail.subject}
                </div>

                {/* Message Preview */}
                <div className="mail-preview text-truncate">
                  {mail.bodyPreview}
                </div>

                {/* Date */}
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