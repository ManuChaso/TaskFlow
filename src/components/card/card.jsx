import { useState, useEffect, useRef } from 'react';
import {useDrag, useDrop} from 'react-dnd';
import './card.css'
import {HexColorPicker} from 'react-colorful'


import contextMenu from '../../utils/context-menu';

function Card({cardInfo, socket, index, moveCard}) {
  const [editing, setEditing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [editColors, setEditColors] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('')
  const [textColor, setTextColor] = useState('');
  const [card, setCard] = useState({tasks: []});

  const inputRef = useRef(null);

  useEffect(() => {
    setCardName(cardInfo.name);
    setBackgroundColor(cardInfo.background);
    setTextColor(cardInfo.textColor);
    setCard(cardInfo);
  }, [cardInfo])

  useEffect(() => {
    if(editing){
      inputRef.current.focus();
    }
  }, [editing])

  const handleBlur = (e, event) => {
    if(event){
      if(e.key === 'Enter'){
        setEditing(false);
        socket.send(JSON.stringify({action: 'updateCard', cardName: cardName, cardId: cardInfo._id}));
      }
    }else{
      setEditing(false);
      socket.send(JSON.stringify({action: 'updateCard', cardName: cardName, cardId: cardInfo._id}));
    }
  }

  const createTask = (e, event) => {
    const task = {
      name: e.target.value
    }
    console.log(e.target.value)
    if(event){
      if(e.key === 'Enter' && e.target.value != ''){
        socket.send(JSON.stringify({action: 'createTask', task: task, cardId: cardInfo._id}));
         e.target.value = ''
      }
    }else if (!event && e.target.value != ''){
      setEditing(false);
      socket.send(JSON.stringify({action: 'createTask', task: task, cardId: cardInfo._id}));
       e.target.value = ''
    }
  }

  const deleteCard = () => {
    socket.send(JSON.stringify({action: 'deleteCard', cardId: cardInfo._id}))
  }

  const changeColor = () => {
    const colors = {
      background: backgroundColor,
      textColor: textColor
    }
    socket.send(JSON.stringify({action: 'editCardStyle', cardId: cardInfo._id, colors: colors}));
    setEditColors(false);
  }

  const moveTask = (dragIndex, hoverIndex, dragCardId, hoverCardId, taskId) => {
    if (dragCardId === hoverCardId) {
      const updatedTasks = [...card.tasks];
      const [draggedTask] = updatedTasks.splice(dragIndex, 1);
      updatedTasks.splice(hoverIndex, 0, draggedTask);
      setCard({...card, tasks: updatedTasks});
      socket.send(JSON.stringify({ action: 'reorderTasks', cardId: card._id, tasks: updatedTasks }));
      // Actualiza el estado del proyecto aquí si es necesario
    } else {
      socket.send(JSON.stringify({ action: 'transferTask', originCard: dragCardId, destinationCard: hoverCardId, taskId: taskId}));
      // Lógica para mover tareas entre tarjetas diferentes si es necesario
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);;
        draggedItem.index = index;
      }
    }
  });

  const [, dropTask] = useDrop({
    accept: 'TASK',
    hover: (item) => {
      if (card.tasks.length === 0) {
        moveTask(item.index, 0, item.cardId, card._id, item.taskId);
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className='card' onContextMenu={(e) =>
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
        <h3 className='card-title' onClick={() => setEditing(true)} style={{background: backgroundColor, color: textColor}}>{cardInfo.name}</h3>
      }
        <ul className='task-container' ref={dropTask}>
          {card?.tasks.map((task, index) => 
            <Task key={index} task={task} socket={socket} cardId={cardInfo._id} index={index} moveTask={moveTask}/>
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
          <button className='edit-color-close' onClick={() => {setEditColors(false); setBackgroundColor(cardInfo.background); setTextColor(cardInfo.textColor)}}>X</button>
            <h3>Background</h3>
            <HexColorPicker color={backgroundColor} onChange={setBackgroundColor}/>
            <h3>Text Color</h3>
            <HexColorPicker color={textColor} onChange={setTextColor}/>

            <button className='apply-colors' onClick={changeColor}>Apply</button>
        </div>}
    </div>
  )
}

function Task({task, index, socket, cardId, moveTask}){
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

  const deleteTask = () => {
    socket.send(JSON.stringify({action: 'deleteTask', cardId: cardId, taskId: task._id}));
  }

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index, cardId, taskId: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ['TASK', 'CARD'],
    hover: (draggedItem) => {
      console.log('Task id', task._id)
      if (draggedItem.index !== index || draggedItem.cardId !== cardId) {
        moveTask(draggedItem.index, index, draggedItem.cardId, cardId, draggedItem.taskId);
        draggedItem.index = index;
        draggedItem.cardId = cardId;
      }
    },
  });

    return(
        (!editing ? 
        <li
          ref={(node) => drag(drop(node))}
          className='task'
          onClick={() => setEditing(true)}
          onContextMenu={(e) =>
            contextMenu({
              e: e,
              options: [
                {text: 'Remove task', function: () => deleteTask()},
                ]})}>
          {text}</li> : 
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
