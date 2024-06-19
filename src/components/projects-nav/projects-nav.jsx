import { useState, useEffect, useRef } from 'react'
import './projects-nav.css'
import contextMenu from '../../utils/context-menu';
import notification from '../../utils/notification';

import closeIcon from '../../assets/icons/close.png';
import FetchApi from '../../utils/api-fetch';
import exportProject from '../../utils/export-project';


function ProjectsNav({addTab, selectTab, deleteTab, tabs, selected}) {
  const [projects, setProjects] = useState([]);
  const [showNavBar, setShowNavBar] = useState(false);
  const navBarRef = useRef(null);

  useEffect(() => {
      FetchApi('GET', 'get-projects')
      .then(res => {
        if(res.success){
          setProjects(res.projects)
        }
      });

      const handleClickOutside = (event) => {
        if (navBarRef.current && !navBarRef.current.contains(event.target)) {
            setShowNavBar(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [tabs]);

  const deleteProject = async (project) => {
    try{

      const accept = await notification('Delete project?', true);

      if(accept){
        const res = await FetchApi('POST', 'delete-project', {
          projectId: project._id
        })

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
    <div ref={navBarRef} className={showNavBar ? 'projects-nav-container' : 'projects-nav-hidden'}>
      <button onClick={() => setShowNavBar(!showNavBar)} className='show-navBar'><img className={showNavBar ? 'open-button' : 'close-button'} src={closeIcon} alt="" /></button>
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
            {text: 'Remove project', function: () => deleteProject(project)},
            {text: 'Export project', function: () => exportProject(project._id)}
          ]
        })
      }}
      >
      <h3 title={project.name}>{project.name}</h3>
    </div>
  )
}

export default ProjectsNav
 