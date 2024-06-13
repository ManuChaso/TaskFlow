import { useState, useEffect } from 'react'
import './taskFlow.css'

import ProjectsNav from '../projects-nav/projects-nav'
import Tabs from '../tabs/tabs'
import Dashboard from '../dashboard/dashboard'
import Header from '../header/header'

import Logo from '../../assets/images/taskFlow-logo.png';

function TaskFlow() {
  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState(0)

  const addTab = (name, id, create) => {
    const newTab = {
      name: name,
      id: id,
      new: create
    }
    setTabs([...tabs, newTab]);
  }

  const selectTab = (index) => {
    setCurrentTab(index)
  }

  const deleteTab = (id) => {
    setTabs(tabs.filter(tab => tab.id != id));

    if(id == tabs[currentTab].id){
      setCurrentTab(0)
    }
    if(currentTab > tabs.length - 2){
      setCurrentTab(0)
    }

    console.log(currentTab)
  }

  const updateTab = (id, updatedData) => {
    const updatedTabs = tabs.map(tab => 
      tab.id == id ? {...tab, ...updatedData} : tab
    );
    setTabs(updatedTabs)
  }

  return (
    <div className='taskFlow-container'>
      <Header/>
      <div className='app-container'>
        <ProjectsNav addTab={addTab} selectTab={selectTab} deleteTab={deleteTab} tabs={tabs} selected={tabs.length > 0 && tabs[currentTab].id}/>
        <div className='work-container'>
          <Tabs tabs={tabs} selectTab={selectTab} deleteTab={deleteTab} currentTab={currentTab}/>
          {tabs.length > 0 ? (<Dashboard updateTab={updateTab} tab={tabs[currentTab]}/>) : (
            <div className='start-project'>
              <img src={Logo} alt="Web logo" />
              <h3>Create a project or select one</h3>
            </div>)}
        </div>
      </div>
    </div>
  )
}

export default TaskFlow
