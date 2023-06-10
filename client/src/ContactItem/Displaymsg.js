import React from 'react';
import './ContactItem.css';

function Displaymsgg({ content, created, sender, authUserId }) {
    const date = new Date(created);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const authUsername = localStorage.getItem('username');
    
    // Check if sender has 'username'
    if (!sender.username) {
        console.log('Sender does not have a username: ', sender);
    }
    
    const isSentByAuthUser = sender.username === authUsername;

    return (
        <div className={`message-cloud ${isSentByAuthUser ? "sent-message" : "received-message"}`}>
            <div id="msgfoo">{content}</div>
            <br />
        </div>
    );
}

export default Displaymsgg;