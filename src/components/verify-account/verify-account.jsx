import { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import './verify-account.css'

import loadingGif from '../../assets/icons/loading.gif';
import notification from '../../utils/notification';

function VerifyAccount() {
    const [loading, setLoading]= useState(true);
    const location = useLocation();

    const asyncLocalStorage = {
        setItem: async (key, value) => {
            return Promise.resolve().then(() => {
                localStorage.setItem(key, value);
            });
        },
        getItem: async (key) => {
            return Promise.resolve().then(() => {
                return localStorage.getItem(key);
            })
        }   
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const url = import.meta.env.VITE_API_URL;
        const API_KEY = import.meta.env.VITE_API_KEY;

        fetch(`${url}verify-account`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'API_KEY': `${encodeURIComponent(API_KEY)}`
            },
            body: JSON.stringify({
                email: `${queryParams.get('email')}`,
                password: `${encodeURIComponent(queryParams.get('pass'))}`
            })
        })
        .then(response => response.json())
        .then(async res => {
            if(res.access){
                await asyncLocalStorage.setItem('token', res.token)
                const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
                window.history.replaceState({ path: newUrl }, '', newUrl);
                window.location.pathname = '/'

            }else{
                notification(res.message, false, 'error');
                setLoading(false);
            }
        })
    }, [])

  return (
    <div className='verify-account'>
      {loading ?
        <div className='verifying'>
            <h3>Verifying account...</h3>
            <img src={loadingGif} alt="" />
        </div> :
        <div className='verified'>
            <h3>Verified</h3>
        </div>}
    </div>
  )
}

export default VerifyAccount
