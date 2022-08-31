import React from 'react'
import './navbar.scss'

import SearchIcon from '@mui/icons-material/Search';

export default function Navbar() {
  return (
    <div className='navbar'>
        <div className="wrapper">
            <div className="left">
                <input type="text" name="searchStart"></input>
                <button><SearchIcon className='ico'></SearchIcon></button>
            </div>
            <div className="cent">
                    <img src='../assets/logo.png' alt=""></img>
            </div>
            <div className="right">
            <input type="text" name="searchConv"></input>
                <button><SearchIcon className='ico'></SearchIcon></button>

            </div>
        </div>
    </div>
  )
}
