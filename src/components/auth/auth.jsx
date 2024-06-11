import { useState } from 'react'
import './auth.css'

import Register from '../register/register'
import Login from '../login/login'

import Logo from '../../assets/images/taskFlow-logo.png';

function Auth({authorization}) {
    const [login, setLogin] = useState(false);

    const changeAuthScreen = () =>{
        setLogin(!login)
    }

  return (
    <div className='auth-container'>
      <img className='auth-logo' src={Logo} alt="" />
      {login ? <Login authorization={authorization} changeAuthScreen={changeAuthScreen}/> : <Register changeAuthScreen={changeAuthScreen}/>}
    </div>
  )
}

export default Auth
