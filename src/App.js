import React from "react";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Welcome from "./components/Welcome";

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
          <Welcome />
        </Route>

        <Route exact path="/">
          <Signup />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
