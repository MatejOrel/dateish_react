import React from 'react';
import "./Chats.css";
import Chat from "./Chat";

function Chats() {
    return (
        <div className="chats">
            <Chat
                name="Mark"
                message="yo what's up"
                timestamp="40 seconds ago"
                profilePic="https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg"
            />
            <Chat
                name="Mark2"
                message="yo what's up2"
                timestamp="40 seconds ago2"
                profilePic="https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg"
            />
        </div>
    )
}

export default Chats
