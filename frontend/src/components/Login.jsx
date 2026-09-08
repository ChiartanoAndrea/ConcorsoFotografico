import { Alert, Container } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router';
import { LoginForm } from './AuthComponents';

function Login(props) {
  const navigate = useNavigate();

  return (
    /* Sfondo grigio chiaro a tutto schermo, contenuto centrato verticalmente e orizzontalmente */
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light w-100">
      
      <Container className="d-flex flex-column justify-content-center align-items-center">
        
        {/* Box per i messaggi di Alert (stessa larghezza massima della Card) */}
        {props.message && (
          <div style={{ maxWidth: '450px', width: '100%' }} className="mb-3">
            <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>
              {props.message.msg}
            </Alert>
          </div>
        )}

        {/* Card bianca con ombra, bordi arrotondati e larghezza massima fissa */}
        <div 
          className="bg-white p-4 p-md-5 rounded-4 shadow" 
          style={{ maxWidth: '450px', width: '100%' }}
        >
          
          <h2 className="text-center fw-bold mb-4">Effettua l'accesso</h2>
          
          {/* Il tuo componente Form autenticazione */}
          <LoginForm handleLogin={props.handleLogin} />
          
          {/* L'Outlet per eventuali rotte annidate */}
          <Outlet />

        </div>
      </Container>
      
    </div>
  );
}

export default Login;