import React from 'react';
import './ContactItem.css';

function ContactItem({ contact, set, setdis }) {
    // Here we are destructuring the contact object
    const { username, displayName, profilePic, _id, chatId } = contact;


    const handleContactClick = () => {
        set({ name: username, img: profilePic, id: chatId }); // Use chatId instead of _id

        const jwt = localStorage.getItem('jwt');
        fetch(`http://localhost:3000/api/Chats/${chatId}/messages`, {
            headers: {
                'Authorization': `${jwt}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error(`Server error: ${data.error}`);
            } else {
                setdis(data);
            }
        })
        .catch((error) => {
            console.error(`Fetch error: ${error}`);
        });
    };

    return (
        <div className="row bar10">
            <button type="button" id="foo7" onClick={handleContactClick} className="btn btn-outline-primary col-12 p-3 mb-2">
                <img src={profilePic} className="baz6" alt="" />
                <span className="text-black">
                    {displayName}
                </span>
            </button>
        </div>
    );
}

export default ContactItem;
