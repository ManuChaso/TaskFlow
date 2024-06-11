import { useState, useEffect } from 'react'
import './project-form.css'

function ProjectForm({updateTab, tab}) {
  const [projectName, setProjectName]= useState('')
  const [projectDescription, setProjectDescription]= useState('')

  const handleProjectForm = async () => {
    try{ 
      const url = import.meta.env.VITE_API_URL;
      const API_KEY = import.meta.env.VITE_API_KEY;
      const token = localStorage.getItem('token');

      const projectData = {
        name: projectName,
        description: projectDescription
      }

      const response = await fetch(`${url}create-project`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'API_KEY': `${encodeURIComponent(API_KEY)}`,
          'authorization': `${token}`
        },
        body: JSON.stringify(projectData)
      });

      const res = await response.json();

      if(res.success){
        const newTab = {
          name: res.project.name,
          id: res.project._id,
          new: false
        }
        updateTab(tab.id, newTab)
      }else{
        console.log('mal', res)
      }

    } catch(err) {
      console.error('Error creating project', err);
    }
  }

  return (
    <div className='project-form'>
        <h2>Create project</h2>

        <input type="text" placeholder='Project name' onChange={(e) => setProjectName(e.target.value)}/>
        <textarea placeholder='Project description' onChange={(e) => setProjectDescription(e.target.value)}></textarea>

        <button onClick={handleProjectForm}>Create</button>
    </div>
  )
}

export default ProjectForm
