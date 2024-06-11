import { useState, useEffect } from 'react'
import './work-space.css'

import Card from '../card/card';
import ToolBar from '../tool-bar/tool-bar';

function WorkSpace({tab}) {
    const [project, setProject] = useState({name: '', cards: [], members: []});
    const [socket, setSocket]= useState(null);

    useEffect(() => {
       const ws = new WebSocket('ws://localhost:3000');
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

  return (
    <div className='work-space'>
        <ToolBar projectData={project} socket={socket}/>
        <h1>{project.name}</h1>

        <div className='cards-container'>
            {project.cards.map((card, index) => 
                <Card key={index} card={card} socket={socket}/>
            )}
            <div className='create-card'>
                <button onClick={createCard} className='add-card'>+</button>
            </div>
        </div>
    </div>
  )
}

export default WorkSpace
