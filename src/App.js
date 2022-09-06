import Main from "./components/Main";
import Navbar from "./components/Navbar";
import axios from 'axios'
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Login from "./components/Login";
import Register from "./components/Register";
import {fetchLastContacts , getUser} from './redux/messageSlice.js'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate 
  
} from "react-router-dom";
import Update from "./components/Update";



function App() {
  
  const dispatch = useDispatch()
  const {loggedInUser} = useSelector((state)=>state.user)

  const [openLogin, setOpenLogin] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const loginPopup = () => {
    setOpenLogin(!openLogin);
  }
  const updatePopup = () => {
    setOpenUpdate(!openUpdate);
  }
  const registerPopup = () => {
    setOpenRegister(!openRegister);
  }

  
  return (
    <div className="app">
       <BrowserRouter>
      <Navbar actionUpdate = {updatePopup} openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} ></Navbar>
      <Routes>
            <Route path="/">
              <Route index element={<Main className='main'  actionLogin = {loginPopup}  openLogin={openLogin} setOpenLogin = {setOpenLogin} actionRegister = {registerPopup} openRegister={openRegister} setOpenRegister = {setOpenRegister}></Main>}/>
            </Route>
          </Routes>
      {openLogin && <Login handleClose={loginPopup}/>}
      {openUpdate && <Update openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} hendleClose={updatePopup}></Update>}
      {openRegister && <Register handleClose={registerPopup}/>}
      </BrowserRouter>
    </div>
  )
}

export default App;
