import { useState, useEffect } from 'react'
import './login.css'
import notification from '../../utils/notification'

function Login({changeAuthScreen, authorization, setLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);

    useEffect(() =>{
        const token = localStorage.getItem('token');
        token && setLogin(true);
    }, [])

    const handleRegister = async () => {
        try{
            const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if(email != '' && password != '' && emailFormat.test(email)){
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
                }else{
                    notification(res.message, false, 'error');
                }
            }else{
                setEmailError(email == '' ? true: false);
                setPassError(password == '' ? true: false);

                if(!emailFormat.test(email)){
                    notification('Invalid email', false, 'error');
                }else{
                    notification('Fields with * cannot be empty', false, 'error')
                }
            }
        } catch(err){
            console.error('Error fetching', err)
        }
    }

  return (
    <div className='login-container'>
        <div className='login-form'>
            <h2>Login</h2>

            <input className={emailError ? 'wrong-input' : 'form-input'} type="text" placeholder='* Email...' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={passError ? 'wrong-input' : 'form-input'} type="password" placeholder='* Password...' value={password} onChange={(e) => setPassword(e.target.value)}/>

            <button className='login-button' onClick={handleRegister}>Login</button>
            
            <button className='go-login' onClick={changeAuthScreen}>Or Create account</button>
        </div>
    </div>
  )
}

export default Login
