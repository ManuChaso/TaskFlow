import { useState, useEffect } from 'react';
import './chat.css'


function Chat({project, socket}) {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log(project.messages)
        setChat(project.messages)

        const chatContainer = document.querySelector('.messages-container');
        chatContainer.scrollTop = chatContainer.scrollHeight

    }, [project])
    const Message = ({message}) => {
        return(
            <li className='message'>
                <span>- {message.owner}:</span>
                <p>{message.text}</p>
            </li>
        )
    }

    const sendMessage = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            if(message != ''){
                console.log('Entra')
                const userId = localStorage.getItem('user_id');
                socket.send(JSON.stringify({action: 'chatMessage', projectId: project._id, userId: userId, messageText: message}));
                setMessage('')
            }
        }
    }

  return (
    <div className='chat'>
        <h2>Notes</h2>

        <ul className='messages-container'>
            {chat && chat.map((message, index) => 
                <Message key={index} message={message} />
            )}
          </ul>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => sendMessage(e)} className='chat-input' type="text" placeholder='Message...' />
    </div>
  )
}

export default Chat
