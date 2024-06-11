import { useState, useEffect, useRef } from 'react'
import './card.css'
import {HexColorPicker} from 'react-colorful'


import contextMenu from '../../utils/context-menu';

function Card({card, socket}) {
  const [editing, setEditing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [editColors, setEditColors] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('')
  const [textColor, setTextColor] = useState('')

  const inputRef = useRef(null);

  useEffect(() => {
    setCardName(card.name);
    setBackgroundColor(card.background);
    setTextColor(card.textColor)
  }, [card])

  useEffect(() => {
    if(editing){
      inputRef.current.focus();
    }
  }, [editing])

  const handleBlur = (e, event) => {
    if(event){
      if(e.key === 'Enter'){
        setEditing(false);
        socket.send(JSON.stringify({action: 'updateCard', cardName: cardName, cardId: card._id}));
      }
    }else{
      setEditing(false);
      socket.send(JSON.stringify({action: 'updateCard', cardName: cardName, cardId: card._id}));
    }
  }

  const createTask = (e, event) => {
    const task = {
      name: e.target.value
    }
    console.log(e.target.value)
    if(event){
      if(e.key === 'Enter' && e.target.value != ''){
        socket.send(JSON.stringify({action: 'createTask', task: task, cardId: card._id}));
         e.target.value = ''
      }
    }else if (!event && e.target.value != ''){
      setEditing(false);
      socket.send(JSON.stringify({action: 'createTask', task: task, cardId: card._id}));
       e.target.value = ''
    }
  }

  const deleteCard = () => {
    socket.send(JSON.stringify({action: 'deleteCard', cardId: card._id}))
  }

  const changeColor = () => {
    const colors = {
      background: backgroundColor,
      textColor: textColor
    }
    socket.send(JSON.stringify({action: 'editCardStyle', cardId: card._id, colors: colors}));
    setEditColors(false);
  }

  return (
    <div className='card' onContextMenu={(e) =>
      contextMenu({
        e: e,
        options: [
          {text: 'Remove', function: () => deleteCard()},
          {text: 'Edit styles', function: () => setEditColors(true)}
          ]})}>
      {editing ? 
        <input
          className='card-name'
          ref={inputRef}
          type="text"
          value={cardName}
          style={{background: card.background, color: card.textColor}}
          onChange={(e) => setCardName(e.target.value)}
          onBlur={(e) => handleBlur(e, false)}
          onKeyDown={(e) => handleBlur(e, true)}
        />
        :
        <h3 className='card-title' onClick={() => setEditing(true)} style={{background: backgroundColor, color: textColor}}>{card.name}</h3>
      }
        <ul className='task-container'>
          {card.tasks.map((task, index) => 
            <Task key={index} task={task} socket={socket} cardId={card._id}/>
          )}
          <input
            className='create-task'
            type="text"
            placeholder='New task'
            onBlur={(e) => createTask(e, false)}
            onKeyDown={(e) => createTask(e, true)}
            />
        </ul>

        {editColors && <div className='edit-colors'>
          <button className='edit-color-close' onClick={() => {setEditColors(false); setBackgroundColor(card.background); setTextColor(card.textColor)}}>X</button>
            <h3>Background</h3>
            <HexColorPicker color={backgroundColor} onChange={setBackgroundColor}/>
            <h3>Text Color</h3>
            <HexColorPicker color={textColor} onChange={setTextColor}/>

            <button className='apply-colors' onClick={changeColor}>Apply</button>
        </div>}
    </div>
  )
}

function Task({task, socket, cardId}){
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef(null)


  useEffect(() => {
    setText(task.name)
  }, [task])

  useEffect(() => {
    if(editing){
      inputRef.current.focus();
    }
  }, [editing])

  const handleBlur = (e, event) => {
    if(event){
      if(e.key === 'Enter'){
        setEditing(false);
        socket.send(JSON.stringify({action: 'updateTask', taskName: text, taskId: task._id, cardId: cardId}));
      }
    }else{
      setEditing(false);
      socket.send(JSON.stringify({action: 'updateTask', taskName: text, taskId: task._id, cardId: cardId}));
    }
  }

    return(
        (!editing ? 
        <li className='task' onClick={() => setEditing(true)}>{task.name}</li> : 
        <input
          className='update-task'
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
          onBlur={(e) => handleBlur(e, false)}
          onKeyDown={(e) => handleBlur(e, true)}
          />
      )
    )
}


export default Card
