import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import "./ChatScreen.css";

function ChatScreen() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            name: "Mark",
            image: "https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg",
            message: "whats up bitch"
        },
        {
            name: "Mark",
            image: "https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg",
            message: "ok"
        },
        {
            name: "Mark",
            image: "https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg",
            message: "kaj dogaja"
        },
        {
            message: "kaj dogaja"
        },
    ])

    const handleSend = e => {
        e.preventDefault();

        setMessages([...messages, { message: input }]);
        setInput("");
    }

    return (
        <div className="chatScreen">
            <p className="chatScreen__timestamp">YOU MATCHED WITH THIS GUY ON THIS DATE</p>
            {messages.map(message => (
                message.name ? (
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
            ))}

            <form className="chatScreen__input">
                <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                className="chatScreen__inputField"
                placeholder="Type a message..." type="text" />
                <button onClick={handleSend} type="submit" className="chatScreen__inputButton">SEND</button>
            </form>
        </div>
    )
}

export default ChatScreen
