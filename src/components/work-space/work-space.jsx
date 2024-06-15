import { useState, useEffect } from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import './work-space.css'

import Card from '../card/card';
import ToolBar from '../tool-bar/tool-bar';

function WorkSpace({tab}) {
    const [project, setProject] = useState({name: '', cards: [], members: []});
    const [socket, setSocket]= useState(null);

    useEffect(() => {
       const ws = new WebSocket('wss://taskflow-api-2plu.onrender.com');
       ws.onopen = () => {
        setSocket(ws);
        ws.send(JSON.stringify({action: 'startSession', projectId: tab.id}))
       }

       ws.onmessage = (event) =>{
        const data = JSON.parse(event.data);
        console.log(data.project)
        if(data.project){
            console.log('Llega')
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
            tasks: [{name: 'First task'}],
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
    </div>
  )
}

export default WorkSpace
