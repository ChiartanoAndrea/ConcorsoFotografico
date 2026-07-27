import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import { useState } from 'react';


function Home(props) {
  const navigate = useNavigate();
  

  const goToLogin = () => {// faccio qua perchè se no ho problemi di sincronizzazione che mi crea prima i componenti senza carte però
   navigate('/login');
  };

  return (
    <>
      <div>
        <h1 className='display-1'>Concorso Fotografico</h1>
        <h3>Vota per le tue immagini preferite</h3>
        <br />
        <Button className='bg-danger' onClick={goToLogin}>
          Registrati o Accedi per iniziare a votare
        </Button>
      </div>
    </>
  );
}

export default Home;
