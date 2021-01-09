import React from 'react';
import "./Chat.css";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";

function Chat({ chatId, name, profilePic }) {
    return (
        <Link to={`/chat/chatId=${chatId}`}>
            <div className="chat">
                <Avatar className="chat__image" src={profilePic} />
                <div className="chat__details">
                    <h2>{name}</h2>
                </div>
            </div>
        </Link>
    )
}

export default Chat
