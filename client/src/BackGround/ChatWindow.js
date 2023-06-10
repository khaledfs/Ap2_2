import React, { useState, useEffect } from 'react';
import ContactItem from '../ContactItem/ContactItem'
import imgdefault from './Whatsappdefault.jpeg'
import Displaymsgg from '../ContactItem/Displaymsg'
import './ChatWindow.css'
import img2 from './add-friend.png'; // adjust the path to point to your actual image file
import jwtDecode from 'jwt-decode';
import { io } from "socket.io-client";

function ChatWindow() {
    const [contacts, setContacts] = useState([]);
    const [AddnameAttheTop, setnameatthetop] = useState(null);
    const [displaymsg, setdisplaymsg] = useState([]);
    const [loginname, setLoginName] = useState({ name: localStorage.getItem('username') });
    const socket = io('http://localhost:3000'); // replace with your server url
    const jwt = localStorage.getItem('jwt');

    const userId = jwtDecode(jwt).userId;

    useEffect(() => {
        fetch('http://localhost:3000/api/Chats', {
            headers: {
                'Authorization': `${jwt}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const contacts = data.map(chat => {
                const contact = chat.users.find(user => user._id !== userId);
                if (contact) {
                    contact.chatId = chat._id;
                    return contact;
                }
            }).filter(Boolean);
            setContacts(contacts);
        });
    }, []);

    useEffect(() => {
        socket.on("message", message => {
            setdisplaymsg([...displaymsg, message]);
        });

        return () => {
            socket.off("message");
        };
    }, [displaymsg]);
    
    const handleInsert = () => {
        const chatName = prompt("Enter the contact's username", "");
        const jwt = localStorage.getItem('jwt');
    
        if (chatName !== "" && jwt) {
            fetch('http://localhost:3000/api/Chats', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`
                },
                body: JSON.stringify({ username: chatName }),
            })
            .then(response => response.json())
            .then(data => {
                
                const contact = data.users.find(user => user._id !== userId);
                setContacts([...contacts, contact]);
                setnameatthetop({ name: contact.username, img: contact.profilePic, id: data._id });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else {
            alert("Contact username cannot be empty or user not identified");
        }
    };

    const ContactsList = contacts.length > 0 ? contacts.map((contact, key) => {
            return (
                <ContactItem
                    contact={contact}
                    key={key}
                    set={setnameatthetop}
                    setdis={setdisplaymsg}
                />
            );
        }) : <p>No contacts available</p>;


        const domsg = () => {
            var msg = document.getElementById("sendtext").value;
            document.getElementById("sendtext").value = '';
            const jwt = localStorage.getItem('jwt');
            const userId = jwtDecode(jwt).userId; 
    
            if (AddnameAttheTop && msg) {
                socket.emit("message", { chatId: AddnameAttheTop.id, content: msg, sender: userId });
            }
        }
        
    return (
        <>
            <div className='foo2' >
                <div className='bg-success  text-white bg-opacity-50 ' id='foo10'>
                    <div>
                        <img type="button" data-toggle="modal" data-target="#exampleModal" src={img2} onClick={handleInsert} id="img2" alt="buttonpng" border="0"></img>
                        {loginname.name}
                    </div>
                    <span id="do12">
                        {AddnameAttheTop && (
                            <>
                                <div id="foo100">
                                    {AddnameAttheTop.name}
                                </div>
                                <img src={AddnameAttheTop.img} id="foo99"></img>
                            </>
                        )}
                    </span>
                </div>
                <span className='col-4'>
                </span>
                <span id="msgdis" className='col-8'>
              <div id="khalil">
    {AddnameAttheTop && (
        displaymsg.map((msg, index) => (
            <Displaymsgg 
                key={index} 
                content={msg.content} 
                created={msg.created} 
                sender={msg.sender} 
            />
        ))
    )}
</div>
                </span>
                <div className='row foo4 p-2 text-white '>
                    <span className='col-4 bar4'>
                        {ContactsList}
                    </span>
                </div>
                <input type='text' id="sendtext" ></input>
                <button id='sendbutton' onClick={domsg}>send</button>
            </div>
        </>
    );
}

export default ChatWindow;
