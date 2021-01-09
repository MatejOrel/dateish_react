import React, { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
import "./Chats.css";
import Chat from "./Chat";

function Chats() {
  const [matches, setMatches] = useState();

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        fetch("https://dateishapi.herokuapp.com/api/matches?uID=" + user.uid, {
          method: "GET",
        })
          .then((resp) => resp.json())
          .then((users) => {
            const arr = [];
            Object.keys(users).forEach((uid) => {
              arr.push({ uid, ...users[uid] });
            });
            console.log(arr);
            setMatches(arr);
          })
          .catch((error) => console.log("failed", error.message));
      }
    });
  }, []);

  return (
    <div>
      {matches ? (
        <div className="chats">
          {matches.map((person) => (
            <Chat
              name={person.name}
              profilePic={person.profileImageUrl}
              chatId={person.chatId}
            />
          ))}
        </div>
      ) : (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default Chats;
