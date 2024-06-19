import { useState, useEffect } from 'react'
import './register.css'
import notification from '../../utils/notification'
import FetchApi from '../../utils/api-fetch'
import Loading from '../loading/loadinbg'

function Register({changeAuthScreen}) {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [wrongPass, setWrongPass] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [userError, setUserError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {
        setLoading(true)
        try{
            const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if(email != '' && userName != '' && password != '' && confirmPass != '' && emailFormat.test(email)){
                const body = {
                    email,
                    userName,
                    password
                }
    
                const res = await FetchApi('POST', 'register', body);
                if(res.access){
                    setLoading(false)
                    notification('Thank you for registering. Please check your email to verify your account.', false, 'done').then(() => {
                        changeAuthScreen();
                    })
                }else{
                    setLoading(false)
                    notification(res.message, false);
                }
            }else{
                setEmailError(email == '' ? true : false)
                setUserError(userName == '' ? true : false);
                setPassError(password == '' ? true : false);

                if(!emailFormat.test(email)){
                    setLoading(false)
                    setEmailError(true);
                    notification('Invalid email', false, 'error')
                }else{
                    setLoading(false)
                    notification('Fields with * cannot be empty', false, 'error');
                }

            }
        } catch(err){
            console.error('Error fetching')
        }
    }

    const checkPassword = (e) => {
        if(password != e.target.value){
            setWrongPass(true)
        }else{
            setWrongPass(false)
            setConfirmPass(e.target.value);
        }
    }

  return (
    <div className='register-container'>
        <div className='register-form'>
            <h2>Register</h2>

            <input className={emailError ? 'wrong-input' : 'form-input'} type="text" placeholder='* Email...' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={userError  ? 'wrong-input' : 'form-input'} type="text" placeholder='* User name...' value={userName} onChange={(e) => setUserName(e.target.value)}/>
            <input className={passError  ? 'wrong-input' : 'form-input'} type="password" placeholder='* Password...' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input className={wrongPass  ? 'wrong-input' : 'form-input'} type="password" placeholder='* repeat password...' onChange={checkPassword}/>

            <button className='register-button' onClick={handleRegister}>Register</button>
            
            <button className='go-login' onClick={changeAuthScreen}>Or login</button>
        </div>
        <Loading loading={loading}/>
    </div>
  )
}

export default Register
