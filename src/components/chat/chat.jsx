import { useState, useEffect, useRef } from 'react';
import './chat.css'

import closeIcon from '../../assets/icons/close1.png'

import contextMenu from '../../utils/context-menu';

function Chat({project, socket, closeChat}) {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const messageContainer = useRef(null);

    useEffect(() => {
        setChat(project.messages)
    }, [project])

    useEffect(() => {
        scrollDown();
    }, [chat])

    const scrollDown = () => {
        if(messageContainer.current){
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
        }
    }

    const deleteMessage = (messageId) => {
        socket.send(JSON.stringify({action: 'deleteMessage', projectId: project._id, messageId: messageId}))
    }

    const Message = ({message}) => {
        return(
            <li className='message' onContextMenu={(e) =>
                contextMenu({
                  e: e,
                  options: [
                    {text: 'Remove message', function: () => deleteMessage(message._id)},
                    ]})}>
                <span>- {message.owner}:</span>
                <p>{message.text}</p>
            </li>
        )
    }

    const sendMessage = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            if(message.trim() !== ''){
                console.log('Entra')
                const userId = localStorage.getItem('user_id');
                socket.send(JSON.stringify({action: 'chatMessage', projectId: project._id, userId: userId, messageText: message}));
                setMessage('')
            }
        }
    }

  return (
    <div className='chat'>
        <img onClick={closeChat} className='close-chat' src={closeIcon}/>
        <h2>Notes</h2>

        <ul className='messages-container' ref={messageContainer}>
            {chat && chat.map((message, index) => 
                <Message key={index} message={message} />
            )}
          </ul>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => sendMessage(e)} className='chat-input' type="text" placeholder='Message...' />
    </div>
  )
}

export default Chat
