import { useState, useEffect } from 'react'
import './projects-nav.css'
import contextMenu from '../../utils/context-menu';
import notification from '../../utils/notification';

function ProjectsNav({addTab, selectTab, deleteTab, tabs, selected}) {
  const [projects, setProjects]= useState([]);

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem('token');

    fetch(`${url}get-projects`, {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        'API_KEY': `${encodeURIComponent(API_KEY)}`,
        'authorization': `${token}`
      }
    })
      .then(response => response.json())
      .then(res => {
        if(res.success){
          setProjects(res.projects)
        }
      });
  }, [tabs]);

  const deleteProject = async (project) => {
    try{

      const accept = await notification('Delete project?', true);

      if(accept){
        const url = import.meta.env.VITE_API_URL;
        const API_KEY = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem('token');
  
        const response = await fetch(`${url}delete-project`, {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'API_KEY': `${encodeURIComponent(API_KEY)}`,
            'authorization': `${token}`
          },
          body: JSON.stringify({projectId: project._id})
        });
  
        const res = await response.json();
  
        if(res.success){
          console.log(res);
          setProjects(projects.filter(p => p._id != project._id));
          deleteTab(project._id)
          
        }
      }
    } catch(err) {
      console.error('Error deleting project', err);
    }
  }

  return (
    <div className='projects-nav-container'>
      <button className='new-project' onClick={() => {
        addTab('New project', (tabs.length > 0 ? tabs[tabs.length - 1].id + 1 : 0), true);
        selectTab(tabs.length)
        }}>New Project</button>

      <div className='projects-container'>
          {projects && projects.map((project, index) => 
            <Project key={index} project={project} addTab={addTab} selectTab={selectTab} deleteProject={deleteProject} selected={selected} tabs={tabs}/>
          )}
      </div>
    </div>
  ) 
}

function Project({project, addTab, selectTab, deleteProject, selected, tabs}){

  const handleClick = () => {
      let exist = false;
      tabs.forEach((tab, index) => {
        if(tab.id == project._id){
          exist = true
          selectTab(index)
        }
      });

      if(!exist){
        addTab(project.name, project._id, false)
        selectTab(tabs.length)
      }

  }

  return(
    <div
      className={project._id == selected ? 'project-selected' : 'project'}
      onClick={handleClick}
      onContextMenu={(e) => {
        contextMenu({
          e: e,
          options: [
            {text: 'Remove', function: () => deleteProject(project)}
          ]
        })
      }}
      >
      <h3 title={project.name}>{project.name}</h3>
    </div>
  )
}

export default ProjectsNav
 