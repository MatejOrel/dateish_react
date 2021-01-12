import React, { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
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

  const onSwipe = (swipeuid) => (direction) => {
    console.log("You swiped: " + direction);
    var url = "";
    if (direction === "left")
      url = "https://dateishapi.herokuapp.com/api/leftswipe";
    else if (direction === "right")
      url = "https://dateishapi.herokuapp.com/api/rightswipe";

    //console.log(users.uid)

    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        if (swipeuid !== user.uid) {
          fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: swipeuid,
              uId: user.uid,
            }),
          })
            .then(() => {
              console.log("success");
            })
            .catch((error) => console.log("failed", error.message));
        }
      }
    });
  };

  const age = (birth) => {
    const ageDifMs = Date.now() - new Date(birth);
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div>
      {users ? (
        <div className="tinderCards__cardContainer">
          {users.map((person) => (
            <TinderCard
              className="swipe"
              key={person.name}
              preventSwipe={["up", "down"]}
              onSwipe={onSwipe(person.uid)}
            >
              <div
                style={{ backgroundImage: `url(${person.profileImageUrl})` }}
                className="card"
              >
                <h3>
                  {person.name}, {age(person.dateOfBirth)}
                </h3>
              </div>
            </TinderCard>
          ))}
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}

export default TinderCards;
