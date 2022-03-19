import React, { Fragment, useState, useEffect } from 'react';
import './App.css';

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createTheme, ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';

const API = '172.20.30.248:5000'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

toast.configure();

function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(async ()=>{
    try {
      const res = await fetch(
        `http://${API}/auth/verify`, 
        {
          method: "GET",
          headers: {token: localStorage.token}
        }
      ).then(res => res.json());
                  
      (res === true) ? setAuthed(true) : setAuthed(false);

    } catch (error) {
      console.error(error.message);
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Fragment>
        <Router>
          <div className='container'>
            <Routes>
              <Route
                exact path ='/'
                element={<Navigate to="/login"/>}
              />
              <Route 
                exact path='/login' 
                element={!authed ? (<Login setAuth={setAuthed}/>) : (<Navigate to="/dashboard" />) } 
              />
              <Route 
                exact path='/register' 
                element={!authed ? (<Register setAuth={setAuthed}/>) : (<Navigate to="/login" />) } 
              />
              <Route 
                exact path='/dashboard' 
                element={authed ? (<Dashboard setAuth={setAuthed}/>) : (<Navigate to="/login" />)} 
              />
            </Routes>
          </div>
        </Router>
      </Fragment>
    </ThemeProvider>

  );
}

export default App;
