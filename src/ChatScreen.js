import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
import "./ChatScreen.css";
import { matchPath } from "react-router-dom";

function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const chatId = window.location.href.split("chatId=")[1].split("/name=")[0];
  var firstTime = true;

  useEffect(() => {
    //console.log(chatId);
    
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setName(decodeURIComponent(window.location.href.split("name=")[1]));
        fetch("https://dateishapi.herokuapp.com/api/chat?id=" + chatId, {
          method: "GET",
        })
          .then((resp) => resp.json())
          .then((chats) => {
            Object.values(chats).forEach((val) => {
              Object.keys(val).forEach((uid) => {
          
                  firebaseApp
                    .database()
                    .ref("Users/" + uid)
                    .once("value")
                    .then((snapshot) => {
                      setImage(snapshot.child("profileImageUrl").val());
                    });
                
                setMessages((messages) => [
                  ...messages,
                  { name: uid, message: val[uid] },
                ]);
              });
            });
          })
          .catch((error) => console.log("failed", error.message));

        var childData;
        var onDataChange = firebaseApp
          .database()
          .ref("Chat/" + chatId)
          .limitToLast(1)
          .on("value", function (snapshot) {
            if (!firstTime) {
              snapshot.forEach(function (childSnapshot) {
                childData = childSnapshot.val();
              });
              setMessages((messages) => [
                ...messages,
                { name: childData.createdByUser, message: childData.text },
              ]);
            } else {
              firstTime = false;
            }
          });
      }
    });
  }, []);

  const handleSend = (e) => {
    e.preventDefault();

    firebaseApp
      .database()
      .ref("Chat/" + chatId)
      .push()
      .set({ createdByUser: user.uid, text: input });
    setMessages([...messages, { name: user.uid, message: input }]);
    setInput("");
  };

  return (
    <div className="chatScreen">
      <p className="chatScreen__timestamp">YOU MATCHED WITH <div className="chatScreen__name">{name}</div></p>
      {messages.map((message) =>
        message.name !== user.uid ? (
          <div className="chatScreen__message">
            <Avatar
              className="chatScreen__image"
              alt={message.name}
              src={image}
            />
            <p className="chatScreen__text">{message.message}</p>
          </div>
        ) : (
          <div className="chatScreen__message">
            <p className="chatScreen__textUser">{message.message}</p>
          </div>
        )
      )}

      <form className="chatScreen__input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chatScreen__inputField"
          placeholder="Type a message..."
          type="text"
        />
        <button
          onClick={handleSend}
          type="submit"
          className="chatScreen__inputButton"
        >
          SEND
        </button>
      </form>
    </div>
  );
}

export default ChatScreen;
