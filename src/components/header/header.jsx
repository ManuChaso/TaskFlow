import { useState, useEffect, useRef } from 'react'
import './header.css'

import Logo from '../../assets/images/taskFlow-logo.png'

function Header() {
    const [user, setUser] = useState({userName: ''});
    const [profileMenu, setProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const url = import.meta.env.VITE_API_URL;
        const API_KEY = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem('token');

        fetch(`${url}get-profile?token=${token}`, {
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
                setUser(res.profile);
                console.log(res)
            }
        });

        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.pathname = '/'
    }    

    const deleteAccount = () => {
        const url = import.meta.env.VITE_API_URL;
        const API_KEY = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem('token');

        fetch(`${url}delete-account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'API_KEY': `${encodeURIComponent(API_KEY)}`,
                'authorization': `${token}`
            }
        })
        .then(response => response.json())
        .then(res => {
            if(res.success){
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                window.location.pathname = '/'
            }
        })
    }

  return (
    <div className='header'>
        <img src={Logo} alt="" />
        <ul className='app-info'>
            <li>Github</li>
            <li>Linkedin</li>
        </ul>

        <div className='user-info'>
            <div onClick={() =>setProfileMenu(!profileMenu)} className='user'>
                {user?.userName.charAt(0)}
            </div>
        </div>

        {profileMenu && <ul ref={profileMenuRef} className='profile-menu'>
            <li onClick={logout}>Log Out</li>
            <li onClick={deleteAccount}>Delete account</li>
        </ul>}
    </div>
  )
}

export default Header
