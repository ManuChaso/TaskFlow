import { useState, useEffect, useRef } from 'react'
import './header.css'

import { useTheme } from '../../state/theme';

import Logo from '../../assets/images/taskFlow-logo.png'
import notification from '../../utils/notification';

import lightIcon from '../../assets/icons/sun.png';
import darkIcon from '../../assets/icons/moon.png';

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
        notification('Log out?', true).then(accept => {
            if(accept){
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                window.location.pathname = '/'
            }
        })
    }    

    const deleteAccount = async () => {
        try{
            const accept = await notification('Delete account?', true);

            if(accept){
                const url = import.meta.env.VITE_API_URL;
                const API_KEY = import.meta.env.VITE_API_KEY;
                const token = localStorage.getItem('token');
        
                const response = await fetch(`${url}delete-account`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'API_KEY': `${encodeURIComponent(API_KEY)}`,
                        'authorization': `${token}`
                    }
                })
                
                const res = await response.json();

                if(res.success){
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    window.location.pathname = '/'
                }
            }
        } catch(err){
            console.log('Error deleting account', err)
        }
    }

    const ChangeTheme = () => {
        const {theme, toggleTheme} = useTheme();
        const [switchOn, setSwitchOn] = useState(theme);

        useEffect(() =>{
            setSwitchOn(theme)
        }, [theme])

        return(
            <div onClick={() => {
                const newTheme = switchOn == 'light' ? 'dark' : 'light';
                setSwitchOn(newTheme);
                toggleTheme();
            }} className='switch-container'>
                <div className={switchOn === 'light' ? 'switch-on' : 'switch-off'}>
                    <img src={switchOn === 'light' ? lightIcon : darkIcon} alt="" />
                </div>
            </div>
        )
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
            <ChangeTheme/>
        </ul>}
    </div>
  )
}

export default Header
