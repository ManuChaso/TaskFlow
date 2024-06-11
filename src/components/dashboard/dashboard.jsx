import { useState, useEffect } from 'react'
import './dashboard.css'

import ProjectForm from '../project-form/project-form'
import WorkSpace from '../work-space/work-space'

function Dashboard({tab, updateTab}) {

  return (
    <div className='dashboard-container'>
        {tab.new ? <ProjectForm updateTab={updateTab} tab={tab}/> : <WorkSpace tab={tab}/>}
    </div>
  )
}

export default Dashboard
