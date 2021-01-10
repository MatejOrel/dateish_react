import React, { useEffect, useState } from "react";
import Login from "./Login.js";
import Header from "./Header.js";
import TinderCards from "./TinderCards";
import Chats from "./Chats";
import ChatScreen from "./ChatScreen";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { firebaseApp } from "./firebase";
import { Settings } from "./Settings.js";
import Register from "./Register.js";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/chat/chatId=:chatId/name=:name">
            <Header backButton="/chat" />
            <ChatScreen />
          </Route>

          <Route path="/chat">
            <Header backButton="/" />
            <Chats />
          </Route>

          <Route path="/settings">
            <Header backButton="/" />
            <Settings />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/">
            {user ? (
              <div>
                <Header />
                <TinderCards />
              </div>
            ) : (
              <Login />
            )}
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
