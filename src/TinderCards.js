import React, { useState, useEffect } from 'react';
import { firebaseApp } from './firebase';
import TinderCard from "react-tinder-card";
import './TinderCards.css';

function TinderCards() {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        firebaseApp.auth().onAuthStateChanged(async (user) => {
            if (user) {
                fetch('https://dateishapi.herokuapp.com/api/findUsers?uID=' + user.uid, {
                    method: 'GET'

                })
                    .then((resp) => resp.json())
                    .then((users) => {
                        const arr = [];
                        Object.keys(users).forEach(uid => {
                            arr.push({ uid, ...users[uid] })
                        })
                        console.log(arr);
                        setUsers(arr);
                    })
                    .catch((error) => console.log("failed", error.message));
            }
        })

    }, []);


    return (
        <div>
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
        </div>
    );
}

export default TinderCards
