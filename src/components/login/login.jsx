import { useState, useEffect } from 'react'
import './login.css'

function Login({changeAuthScreen, authorization}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() =>{
        const token = localStorage.getItem('token');
        token && setLogged(true);
    }, [])

    const handleRegister = async () => {
        try{
            const url = import.meta.env.VITE_API_URL;
            const API_KEY = import.meta.env.VITE_API_KEY;

            const body = {
                email,
                password
            }

            const response = await fetch(`${url}login`, {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                    'API_KEY': `${encodeURIComponent(API_KEY)}`
                },
                body: JSON.stringify(body)
            });

            const res = await response.json();
            console.log(res);
            if(res.access){
                localStorage.setItem('token', res.token);
                authorization();
            }
        } catch(err){
            console.error('Error fetching', err)
        }
    }

  return (
    <div className='login-container'>
        <div className='login-form'>
            <h2>Login</h2>

            <input className='form-input' type="text" placeholder='Email...' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className='form-input' type="password" placeholder='Password...' value={password} onChange={(e) => setPassword(e.target.value)}/>

            <button className='login-button' onClick={handleRegister}>Login</button>
            
            <button className='go-login' onClick={changeAuthScreen}>Or Create account</button>
        </div>
    </div>
  )
}

export default Login
