import React, {
  useState,
  useEffect,
} from "react";

import {
  Container,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";


const FIREBASE_DATABASE_URL =
  "https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com";


const Inbox = () => {

  const [mails, setMails] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const email =
    localStorage.getItem("email");

  const token =
    localStorage.getItem("token");


  // IMPORTANT:
  // Must be exactly the same as ComposeMail
  const formatEmail = (email) => {
    return email.replace(/[.#$[\]@]/g, "_");
  };


  useEffect(() => {

    const fetchInbox = async () => {

      if (!email) {
        setError(
          "User email not found. Please login again."
        );

        setLoading(false);

        return;
      }

      try {

        const formattedEmail =
          formatEmail(
            email.trim().toLowerCase()
          );

        const url =
          `${FIREBASE_DATABASE_URL}/mails/inbox/${formattedEmail}.json?auth=${token}`;

        console.log(
          "Fetching inbox for:",
          email
        );

        console.log(
          "Formatted Firebase key:",
          formattedEmail
        );

        console.log(
          "Firebase URL:",
          url
        );


        const response =
          await fetch(url);


        if (!response.ok) {

          const errorData =
            await response.json();

          console.log(
            "Firebase Error:",
            errorData
          );

          throw new Error(
            errorData.error ||
            "Failed to fetch mails."
          );
        }


        const data =
          await response.json();

        console.log(
          "Inbox data from Firebase:",
          data
        );


        if (data) {

          const loadedMails =
            Object.entries(data).map(
              ([id, mail]) => {

                return {
                  id,
                  ...mail,
                };

              }
            );

          setMails(loadedMails);

        } else {

          setMails([]);

        }

      } catch (error) {

        console.log(
          "Error fetching inbox:",
          error
        );

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };


    fetchInbox();

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

      <h2>Inbox</h2>


      {error && (

        <Alert variant="danger">

          {error}

        </Alert>

      )}


      {!error && mails.length === 0 && (

        <Alert variant="info">

          No mails found.

        </Alert>

      )}


      <ListGroup>

        {mails.map((mail) => (

          <ListGroup.Item
            key={mail.id}
          >

            <strong>
              From: {mail.from}
            </strong>

            <br />

            <strong>
              Subject: {mail.subject}
            </strong>

            <br />

            <span>

              {mail.bodyPreview}

            </span>

          </ListGroup.Item>

        ))}

      </ListGroup>

    </Container>

  );

};


export default Inbox;