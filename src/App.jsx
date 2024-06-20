import { useState, useEffect } from 'react'
import './App.css'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Auth from './components/auth/auth'
import TaskFlow from './components/taskFlow/taskFlow'
import VerifyAccount from './components/verify-account/verify-account';
import FetchApi from './utils/api-fetch';
import Loading from './components/loading/loadinbg';


function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
    FetchApi('GET', 'get-profile')
      .then(res => {
        if(res.success){
          setAuth(true);
          localStorage.setItem('user_id', res.profile._id)
          setLoading(false)
        }else{
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
      <Loading loading={loading}/>
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
