<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
=======
import React, { useState, useEffect } from 'react';
import { firebaseApp } from './firebase';
>>>>>>> c9b0cc6caa705c4f51fa6cc29f2589604d5f3f19
import TinderCard from "react-tinder-card";
import "./TinderCards.css";
import "./Settings.css";

function TinderCards() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        fetch(
          "https://dateishapi.herokuapp.com/api/findUsers?uID=" + user.uid,
          {
            method: "GET",
          }
        )
          .then((resp) => resp.json())
          .then((users) => {
            const arr = [];
            Object.keys(users).forEach((uid) => {
              arr.push({ uid, ...users[uid] });
            });
            console.log(arr);
            setUsers(arr);
          })
          .catch((error) => console.log("failed", error.message));
      }
    });
  }, []);

  return (
    <div>
      {users ? (
        <div className="tinderCards__cardContainer">
          {users.map((person) => (
            <TinderCard
              className="swipe"
              key={person.name}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{ backgroundImage: `url(${person.profileImageUrl})` }}
                className="card"
              >
                <h3>{person.name}</h3>
              </div>
            </TinderCard>
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

export default TinderCards;
