import { useState, useEffect } from 'react'
import './tool-bar.css'
import contextMenu from '../../utils/context-menu';


function ToolBar({projectData, socket}) {
  const [email, setEmail] = useState('');
  const [project, setProject] = useState({members: []});

  useEffect(() => {
    setProject(projectData);
    console.log(projectData)
  }, [projectData])

  const addMember = () => {
    if(email != ''){
      socket.send(JSON.stringify({action: 'addMember', projectId: project._id, email: email}));
      setEmail('');
    }
  }

  const deleteMember = (id, memberId) => {
    socket.send(JSON.stringify({action: 'deleteMember', projectId: project._id, memberId: memberId, id: id}))
  }

  return (
    <div className='tool-bar'>
        <div className='add-member'>
          <input placeholder='Add member...' type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <button onClick={addMember}>+</button>
        </div>
        <ul className='members'>
            {project.members.map((member, index) => 
                <li 
                key={index}
                onContextMenu={(e) => contextMenu({
                  e: e,
                  options:[
                    {text: 'Remove member', function: () => deleteMember(member.id, member._id) }
                  ]
                })}
                >{member.name.charAt(0)}</li>
            )}
        </ul>
    </div>
  )
}

export default ToolBar
