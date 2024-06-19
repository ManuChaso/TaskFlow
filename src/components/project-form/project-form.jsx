import { useState, useEffect } from 'react'
import './project-form.css'
import notification from '../../utils/notification'
import FetchApi from '../../utils/api-fetch'
import FileDrop from '../filedrop-input/filedrop'
import Loading from '../loading/loadinbg'

function ProjectForm({updateTab, tab}) {
  const [projectName, setProjectName]= useState('')
  const [projectDescription, setProjectDescription]= useState('');
  const [importedProject, setImportedProject] = useState(null);
  const [loading, setLoading]= useState(false);

  const handleProjectForm = async () => {
    setLoading(true)
    try{ 

      if(projectName !== ''){
        const projectData = {
          name: projectName,
          description: projectDescription
        }
  
        const res = await FetchApi('POST', 'create-project', projectData)
  
        if(res.success){
          setLoading(false)
          const newTab = {
            name: res.project.name,
            id: res.project._id,
            new: false
          }
          updateTab(tab.id, newTab)
        }
      }else{
        setLoading(false)
        notification('Name cannot be empty', false, 'error')
      }
    } catch(err) {
      console.error('Error creating project', err);
    }
  }

  const handleFileImport = (project) => {
    setImportedProject(project);
  }

  const importProject = async () => {
    setLoading(true)
    try{
      if(importedProject) {
          const res = await FetchApi('POST', 'import-project', importedProject);

        if(res.success){
          setLoading(false)
          const newTab = {
            name: res.project.name,
            id: res.project._id,
            new: false
          }
          updateTab(tab.id, newTab)
          notification(res.message, false);
        }else{
          setLoading(false)
          console.error('Error fetching', err);
          notification(res.message, false);
        }
      }else{
        setLoading(false)
        notification("Importing nothing usually doesn't work...", false, 'error')
      }
    } catch(err) {
        console.error('Error fetching', err);
        notification('Error importing project. Please, try again later', false, 'error');
    }
  }

  return (
    <div className='project-form'>
        <h2>Create project</h2>

        <input type="text" placeholder='Project name' onChange={(e) => setProjectName(e.target.value)}/>
        <textarea placeholder='Project description' onChange={(e) => setProjectDescription(e.target.value)}></textarea>

        <button onClick={handleProjectForm}>Create</button>
        
        <p>or import an existing project</p>

        <FileDrop handleFileImport={handleFileImport}/>

        <button onClick={importProject}>Import</button>

        <Loading loading={loading}/>
    </div>
  )
}

export default ProjectForm
