import React, {
  useEffect,
  useState,
} from "react";

import {
  Container,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";

const FIREBASE_DATABASE_URL =
  "https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com";

const Sent = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const email =
    localStorage.getItem("email");

  const token =
    localStorage.getItem("token");

  const formatEmailForFirebase = (email) => {
    return email.replace(/[.#$[\]@]/g, "_");
  };

  useEffect(() => {

    const fetchSentMails =
      async () => {

        try {

          const formattedEmail =
            formatEmailForFirebase(email);

          const response =
            await fetch(
              `${FIREBASE_DATABASE_URL}/mails/sent/${formattedEmail}.json?auth=${token}`
            );

          const data =
            await response.json();

          if (data) {

            const loadedMails =
              Object.entries(data).map(
                ([id, mail]) => ({
                  id,
                  ...mail,
                })
              );

            setMails(loadedMails);

          }

        } catch (error) {

          console.log(
            "Error fetching sent mails:",
            error
          );

        } finally {

          setLoading(false);

        }
      };

    fetchSentMails();

  }, [email, token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-4">

      <h2>Sent</h2>

      {mails.length === 0 && (
        <Alert variant="info">
          No sent mails found.
        </Alert>
      )}

      <ListGroup>

        {mails.map((mail) => (

          <ListGroup.Item
            key={mail.id}
          >

            <strong>
              To: {mail.to}
            </strong>

            <br />

            <strong>
              Subject: {mail.subject}
            </strong>

            <p>
              {mail.bodyPreview}
            </p>

          </ListGroup.Item>

        ))}

      </ListGroup>

    </Container>
  );
};

export default Sent;