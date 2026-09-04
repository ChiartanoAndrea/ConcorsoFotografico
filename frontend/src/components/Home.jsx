import { useNavigate } from 'react-router';
import { Button, Container } from 'react-bootstrap';

// Importa le immagini necessarie
import logoDonoper from '../assets/logo_dono.png';
import logoComune from '../assets/logo_castellamonte.png';
import iconaCeramica from '../assets/logo_mostra.png';
import graficaMacchina from '../assets/logo_macchinafoto.png';

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    /* Semplice div contenitore per l'altezza (nessun Container Bootstrap per non vincolare l'header) */
    <div className="vh-100 d-flex flex-column overflow-hidden bg-white w-100">
      
      {/* HEADER: Usa TUTTA la larghezza dello schermo senza restrizioni */}
      <header className="w-100 border-bottom py-3 flex-shrink-0">
        <Container fluid className="px-3 px-md-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <img 
              src={logoDonoper} 
              alt="Un Dono per Castellamonte" 
              className="img-fluid" 
              style={{ maxWidth: '28%', maxHeight: '70px', objectFit: 'contain', objectPosition: 'left' }} 
            />
            <img 
              src={iconaCeramica} 
              alt="Mostra della Ceramica" 
              className="img-fluid" 
              style={{ maxWidth: '40%', maxHeight: '90px', objectFit: 'contain' }} 
            />
            <img 
              src={logoComune} 
              alt="Città di Castellamonte" 
              className="img-fluid" 
              style={{ maxWidth: '28%', maxHeight: '70px', objectFit: 'contain', objectPosition: 'right' }} 
            />
          </div>
        </Container>
      </header>

      {/* MAIN: Usa un Container ristretto (colonna centrata) come volevi */}
      <main className="flex-grow-1 w-100 d-flex justify-content-center align-items-center p-3">
        <Container className="d-flex flex-column justify-content-center align-items-center text-center h-100">
          
          <img 
            src={graficaMacchina} 
            alt="Grafica Concorso Fotografico" 
            className="img-fluid mb-2" 
            style={{ maxHeight: '45vh', objectFit: 'contain' }} 
          />

          <h1 className="display-4 fw-bold text-dark mb-0 mt-3">
            Scatti d'Argilla
          </h1>
          <h2 
            className="h5 text-uppercase text-muted fw-bold mb-4 mt-2" 
            style={{ letterSpacing: '0.15em' }}
          >
            CONCORSO FOTOGRAFICO
          </h2>

          <Button 
            variant="danger" 
            size="lg" 
            className="fw-bold px-5 py-3 rounded-pill shadow-sm" 
            onClick={goToLogin}
          >
            Accedi o Registrati per Votare
          </Button>

        </Container>
      </main>

    </div>
  );
}

export default Home;