import { useState, useEffect } from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend'
import './dashboard.css'

import ProjectForm from '../project-form/project-form'
import WorkSpace from '../work-space/work-space'

function Dashboard({tab, updateTab}) {

  return (
    <div className='dashboard-container'>
        {tab.new ? <ProjectForm updateTab={updateTab} tab={tab}/> : 
        <DndProvider backend={HTML5Backend}>
          <WorkSpace tab={tab}/>
        </DndProvider>}
    </div>
  )
}

export default Dashboard
