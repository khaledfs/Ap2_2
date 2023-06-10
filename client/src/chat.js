import './Chat.css'
import Upper from './BackGround/Upper';
import Lower from './BackGround/Lower';
import ChatWindow from './BackGround/ChatWindow';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Chat() {
    const navigate = useNavigate();

    // check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            
            <Lower />
            <ChatWindow />
        </>
    );
}
export default Chat;

