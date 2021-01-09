import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { firebaseApp } from "./firebase";
import "./ChatScreen.css";

function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    //console.log(chatId);
    const chatId = window.location.href.split("chatId=")[1];
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetch("https://dateishapi.herokuapp.com/api/chat?id=" + chatId, {
          method: "GET",
        })
          .then((resp) => resp.json())
          .then((chats) => {
            var it = 0;
            Object.values(chats).forEach((val) => {
              Object.keys(val).forEach((uid) => {
                setMessages((messages) => [
                  ...messages,
                  { id: it, name: uid, message: val[uid] },
                ]);
                console.log(uid);
                it++;
              });
            });
            console.log(messages);
          })
          .catch((error) => console.log("failed", error.message));
      }
    });
  }, []);

  const handleSend = (e) => {
    e.preventDefault();

    const chatId = window.location.href.split("chatId=")[1];
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
      <p className="chatScreen__timestamp">
        YOU MATCHED WITH THIS GUY ON THIS DATE
      </p>
      {messages.map((message) =>
        message.name !== user.uid ? (
          <div className="chatScreen__message">
            <Avatar
              className="chatScreen__image"
              alt={message.name}
              src={message.image}
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
