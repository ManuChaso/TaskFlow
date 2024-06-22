import { useState, useEffect, useRef } from "react";
import {useDrag, useDrop} from 'react-dnd';
import './task.css'

import contextMenu from '../../utils/context-menu';

export default function Task({task, index, socket, cardId, moveTask}){
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
            {text} <State task={task} socket={socket} cardId={cardId}/> </li> : 
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
  

  function State({task, socket, cardId}){
    const [showState, setShowState] = useState(false);

    const showChangeMenu = (e) => {
        e.stopPropagation();
        setShowState(!showState)
    }

    const changeState = (e) => {
        e.stopPropagation();
        const text = e.target.textContent.toLowerCase()
        setShowState(false);

        socket.send(JSON.stringify({action: 'changeTaskState', cardId, taskId: task._id, newState: text}))
    }

    return(
        <>
        <span onClick={showChangeMenu} className={task.state}>{task.state}</span>
        {showState && 
            <ul className="change-state">
                <li onClick={(e) => changeState(e)}>Urgent</li>
                <li onClick={(e) => changeState(e)}>Pending</li>
                <li onClick={(e) => changeState(e)}>Progress</li>
                <li onClick={(e) => changeState(e)}>Done</li>
            </ul>
        }
        </>
    )
  }