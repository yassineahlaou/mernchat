import Main from "./components/Main";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";



function App() {

  const [openLogin, setOpenLogin] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const loginPopup = () => {
    setOpenLogin(!openLogin);
  }
  const registerPopup = () => {
    setOpenRegister(!openRegister);
  }
  return (
    <div className="app">
      <Navbar></Navbar>
      <Main className='main' actionLogin = {loginPopup} openLogin={openLogin} setOpenLogin = {setOpenLogin} actionRegister = {registerPopup} openRegister={openRegister} setOpenRegister = {setOpenRegister}></Main>

      {openLogin && <Login handleClose={loginPopup}/>}
      {openRegister && <Register handleClose={registerPopup}/>}
      
    </div>
  );
}

export default App;
