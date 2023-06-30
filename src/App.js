import './App.css';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import NoteState from './context/notes/NoteState';
import Alert from './Components/Alert';
import Signup from './Components/Signup';
import Login from './Components/Login';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert= (message, type)=>{
      setAlert({
        msg: message,
        type: type
      })
      setTimeout(() => {
        setAlert(null)
      }, 2000);
  }
  return (
    <>
    <NoteState>
    <BrowserRouter>
    <Navbar/> 
    <Alert alert={alert}/>
      <div className='container mx-5' >
        <Routes>         
            <Route path="/" element={<Home showAlert={showAlert}/>}></Route>
            <Route exact path="/about" element={<About />}></Route> 
            <Route exact path="/login" element={<Login showAlert={showAlert} />}></Route>
            <Route exact path="/signup" element={<Signup showAlert={showAlert} />}></Route>
          </Routes> 
        </div> 
      </BrowserRouter> 
      </NoteState>                        
    </>
  );
}

export default App;
