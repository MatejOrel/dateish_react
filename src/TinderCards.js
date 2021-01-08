import React, { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
import TinderCard from "react-tinder-card";
import "./TinderCards.css";
import "./Settings.css";

function TinderCards() {
  const [users, setUsers] = useState([]);
  var nr_of_users = 0;

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
            nr_of_users = arr.length
          })
          .catch((error) => console.log("failed", error.message));
      }
    });
  }, []);

  const onSwipe = (direction) => {
    console.log("You swiped: " + direction);
    var url = "";
    if (direction === "left")
      url = "https://dateishapi.herokuapp.com/api/leftswipe";
    else if (direction === "right")
      url = "https://dateishapi.herokuapp.com/api/rightswipe";

      console.log(nr_of_users)
      console.log(users[nr_of_users].uid)

    /*firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        fetch(url, {
          method: "POST",
          body: JSON.stringify({
            id: this.uid,
            uId: user.user.uid,
          }),
        })
          .then(() => {
            console.log("success");
          })
          .catch((error) => console.log("failed", error.message));
      }
    });*/
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
              onSwipe={onSwipe}
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
