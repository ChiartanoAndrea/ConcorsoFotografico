import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Navbar, Row } from 'react-bootstrap';
import { Link, Route, Routes, useNavigate,useParams,Outlet, Navigate } from 'react-router';
import API from './API/API.mjs';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import ImagesList from './components/Images.jsx';

function App() {

  const navigate = useNavigate();
  /*  ROUTES
  / => pagina principale(index)
  /login-google
  /listImages => lista immagini
  -* => pagina not found
  */
  const [count, setCount] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  //TODO : logica copiata controllare se funziona
  
  const handleLogin= async (credentials) => {
    try{
      const user= await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg:'Welcome,' + user.username+ '!', type : 'success'})
      setUser(user);

      navigate(`/users/${user.id}/images`);//per andare al match con l'id dell utente
    }
    catch(err){
      setMessage({msg: err.message, type:'danger'})
    }
  };

  const handleLogout= async()=>{
    await API.logout();
    setLoggedIn(false);
    setUser({})//lo metto a oggetto vuoto
    setMessage('');
    navigate('/login');
  }

  useEffect(()=> {
    const checkAuth= async ()=>{
      try{
      //const user= await API.getCurrentUser(); TODO mock del server
      
      const user= null; // TODO: replace with actual API call to check authentication
      if (user && user.id) {
        setLoggedIn(true);
        setUser(user);
        //console.log("Utente autenticato:", user);
      } else {
        setLoggedIn(false);
        setUser({});
        //console.log("Utente non autenticato");
      }
      //setLoggedIn(true);
     // setUser(user);
      //console.log(loggedin);
    }
    catch(err){
      setLoggedIn(false);
      //setUser({});
      console.error("Errore autenticazione", err);
    }
  };
    checkAuth();
  },[])

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login handleLogin={handleLogin} message={message} setMessage={setMessage} handleLogout={handleLogout} loggedin={loggedIn} user={user}/>}/>
        <Route path="users/:userid/images" element={<ImagesList handleLogout={handleLogout} loggedin={loggedIn} user={user} />} /> 
      
      </Routes>
    </>
  )
  
}

export default App
