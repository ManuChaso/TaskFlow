import { useState, useEffect } from 'react'
import './register.css'

function Register({changeAuthScreen}) {
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [wrongPass, setWrongPass] = useState(false)

    const handleRegister = async () => {
        try{
            const url = import.meta.env.VITE_API_URL
            const API_KEY = import.meta.env.VITE_API_KEY
            const body = {
                email,
                userName,
                password
            }

            const response = await fetch(`${url}register`, {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                    'API_KEY': `${encodeURIComponent(API_KEY)}`
                },
                body: JSON.stringify(body)
            });

            const res = await response.json();
            console.log(res);
        } catch(err){
            console.error('Error fetching')
        }
    }

    const checkPassword = (e) => {
        if(password != e.target.value){
            setWrongPass(true)
        }else{
            setWrongPass(false)
        }
    }

  return (
    <div className='register-container'>
        <div className='register-form'>
            <h2>Register</h2>

            <input className='form-input' type="text" placeholder='Email...' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className='form-input' type="text" placeholder='User name...' value={userName} onChange={(e) => setUserName(e.target.value)}/>
            <input className='form-input' type="password" placeholder='Password...' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input className={wrongPass ? 'wrong-pass' : 'form-input'} type="password" placeholder='repeat password...' onChange={checkPassword}/>

            <button className='register-button' onClick={handleRegister}>Register</button>
            
            <button className='go-login' onClick={changeAuthScreen}>Or login</button>
        </div>
    </div>
  )
}

export default Register
