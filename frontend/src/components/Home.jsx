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
    <div className="vh-100 d-flex flex-column overflow-hidden bg-white w-100">
      
      {/* HEADER: Diviso in 3 blocchi flessibili uguali per centrare perfettamente il logo in mezzo */}
      <header className="w-100 border-bottom py-3 flex-shrink-0">
        <Container fluid className="px-3 px-md-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            
            {/* Blocco Sinistro */}
            <div style={{ flex: 1 }} className="d-flex justify-content-start">
              <img 
                src={logoDonoper} 
                alt="Un Dono per Castellamonte" 
                className="img-fluid" 
                style={{ maxHeight: '70px', objectFit: 'contain' }} 
              />
            </div>

            {/* Blocco Centrale */}
            <div style={{ flex: 1 }} className="d-flex justify-content-center text-center">
              <img 
                src={iconaCeramica} 
                alt="Mostra della Ceramica" 
                className="img-fluid" 
                style={{ maxHeight: '90px', objectFit: 'contain' }} 
              />
            </div>

            {/* Blocco Destro */}
            <div style={{ flex: 1 }} className="d-flex justify-content-end">
              <img 
                src={logoComune} 
                alt="Città di Castellamonte" 
                className="img-fluid" 
                style={{ maxHeight: '70px', objectFit: 'contain' }} 
              />
            </div>

          </div>
        </Container>
      </header>

      {/* MAIN: Invariato */}
      <main className="flex-grow-1 w-100 d-flex justify-content-center align-items-center p-3">
        <Container className="d-flex flex-column justify-content-center align-items-center text-center h-100">
          
          <img 
            src={graficaMacchina} 
            alt="Grafica Concorso Fotografico" 
            className="img-fluid mb-2" 
            style={{ maxHeight: '45vh', objectFit: 'contain' }} 
          />

          <h1 className="display-4 fw-bold text-dark mb-0 mt-3">
            Scatti <span style={{ color: '#ba4f38' }}>d'Argilla</span>
          </h1>
          <h2 
            className="h5 text-uppercase text-muted fw-bold mb-2 mt-2" 
            style={{ letterSpacing: '0.15em' }}
          >
            CONCORSO FOTOGRAFICO
          </h2>

          <Button 
            variant="danger" 
            size="lg" 
            className="fw-bold px-5 py-3 rounded-pill shadow-sm mb-5" 
            onClick={goToLogin}
            style={{ backgroundColor: '#ba4f38', borderColor: '#ba4f38' }}
          >
            Accedi o Registrati per Votare
          </Button>

        </Container>
      </main>

    </div>
  );
}

export default Home;