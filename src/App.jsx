import { useState, useEffect } from 'react'
import './App.css'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Auth from './components/auth/auth'
import TaskFlow from './components/taskFlow/taskFlow'
import VerifyAccount from './components/verify-account/verify-account';


function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    console.log(token)

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
        if(res.success){
          console.log(res.profile);
          setAuth(true);
          localStorage.setItem('user_id', res.profile._id)
          setLoading(false)
        }else{
          console.log(res);
          setLoading(false)
        }
      })
    }else{
      setLoading(false);
    }
  }, [])

  const authorization = () => {
    setAuth(true);
  }

  if(loading){
    return(
      <h1>Loading...</h1>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={(auth ? <TaskFlow/> : <Auth authorization={authorization}/>)}/>
        <Route path='/Verify-account' element={<VerifyAccount/>}/>
      </Routes>
    </Router>
  )
}

export default App
