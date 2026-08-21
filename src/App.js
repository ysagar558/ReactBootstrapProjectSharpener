import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import ComposeMail from "./components/ComposeMail";
import Inbox from "./components/Inbox";
import Sent from "./components/Sent";

function App() {
  return (
    <Router>
      <Switch>

        <Route exact path="/signup">
          <Signup />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/welcome">
          <Inbox />
        </Route>

        <Route exact path="/">
          <Signup />
        </Route>

        <Route exact path="/compose">
          <ComposeMail />
        </Route>

        {/* <Route exact path="/inbox">
          <Inbox />
        </Route> */}

        <Route exact path="/sent">
          <Sent />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
