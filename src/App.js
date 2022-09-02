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



function App() {
  
  const dispatch = useDispatch()
  const {loggedInUser} = useSelector((state)=>state.user)

  const [openLogin, setOpenLogin] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const loginPopup = () => {
    setOpenLogin(!openLogin);
  }
  const registerPopup = () => {
    setOpenRegister(!openRegister);
  }

  /*const setNewArr = async (e) =>{
    let testArray = []
    const userData = await axios.get(`/user/find/${loggedInUser._id}`)
    //console.log(userData.data.lastContacts)
    userData.data.lastContacts.map(async (item)=>{
      let userC = await axios.get(`/user/find/${item}`)
      testArray.push(userC)

    })
    setArr(testArray)
    dispatch(fetchLastContacts(arr))
    console.log(arr)
}

if ( loggedInUser != null){
  setNewArr()
}*/

  return (
    <div className="app">
       <BrowserRouter>
      <Navbar ></Navbar>
      <Routes>
            <Route path="/">
              <Route index element={<Main className='main'   actionLogin = {loginPopup} openLogin={openLogin} setOpenLogin = {setOpenLogin} actionRegister = {registerPopup} openRegister={openRegister} setOpenRegister = {setOpenRegister}></Main>}/>
            </Route>
          </Routes>
      {openLogin && <Login handleClose={loginPopup}/>}
      {openRegister && <Register handleClose={registerPopup}/>}
      </BrowserRouter>
    </div>
  )
}

export default App;
