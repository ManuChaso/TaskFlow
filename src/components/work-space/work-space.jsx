import { useState, useEffect, useRef} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import './work-space.css'

import chatIcon from '../../assets/icons/chat.png';

import Card from '../card/card';
import ToolBar from '../tool-bar/tool-bar';
import Chat from '../chat/chat';

function WorkSpace({tab}) {
    const [project, setProject] = useState({name: '', cards: [], members: []});
    const [socket, setSocket] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [notification, setNotification] = useState(false);
    const chatRef = useRef(showChat);

    useEffect(() => {
        chatRef.current = showChat
    }, [showChat])

    useEffect(() => {
        const WS_URL = import.meta.env.VITE_WS_URL
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({action: 'startSession', projectId: tab.id}))
        }

        ws.onmessage = (event) =>{
            const data = JSON.parse(event.data);
            if(data.project){
                if(data.message && !chatRef.current){
                    setNotification(true)
                }
                setProject(data.project);
            }
        }

        return () =>{
            if(socket)
                socket.close()
        }

    }, [tab]);

    const createCard = () => {
        const cardInfo = {
            name: 'New card',
            tasks: [{name: 'First task', state: 'pending'}],
            background: '#3cdbd6',
            textColor: '#ffffff'
        }

        socket.send(JSON.stringify({action: 'createCard', card: cardInfo}));
    }

    const moveCard = (dragIndex, hoverIndex) => {
        const updateCards = [...project.cards];
        const [draggedCard] = updateCards.splice(dragIndex, 1);
        updateCards.splice(hoverIndex, 0, draggedCard);
        setProject((prevProject) => ({...prevProject, cards: updateCards}));

        socket.send(JSON.stringify({action: 'reorderCards', cards: updateCards, projectId: project._id}));
    }

  return (
    <div className='work-space'>
        <ToolBar projectData={project} socket={socket}/>
        <h1>{project.name}</h1>

        <div className='cards-container'>
            {project.cards.map((card, index) => 
                <Card index={index} key={index} cardInfo={card} socket={socket} moveCard={moveCard}/>
            )}
            <div className='create-card'>
                <button onClick={createCard} className='add-card'>+</button>
            </div>
        </div>

        <button
            onClick={() => {
                setShowChat(!showChat);
                setNotification(0)
            }}
            className={notification ? 'chat-button animated-button' : 'chat-button'}>
                <img src={chatIcon} alt="" />
        </button>
        {showChat && <Chat project={project} socket={socket} closeChat={() => setShowChat(false)}/>}
    </div>
  )
}

export default WorkSpace
