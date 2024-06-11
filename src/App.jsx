import { useState, useEffect } from 'react'
import './App.css'

import Auth from './components/auth/auth'
import TaskFlow from './components/taskFlow/taskFlow'


function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    if(token){
      fetch(`${url}get-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'API_KEY': `${encodeURIComponent(API_KEY)}`,
          'authorization': `${token}`
        }
      })
      .then(response => response.json())
      .then(res => {
        console.log(res.profile);
        setAuth(true);
        localStorage.setItem('user_id', res.profile._id)
      })
    }
  }, [])

  const authorization = () => {
    setAuth(true);
  }
  return (
    (auth ? <TaskFlow/> : <Auth authorization={authorization}/>)
  )
}

export default App
