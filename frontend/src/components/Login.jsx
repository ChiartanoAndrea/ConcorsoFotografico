import { Alert, Row } from 'react-bootstrap';
import { useNavigate,Outlet } from 'react-router';
import { LoginForm} from './AuthComponents';
function Login(props){

  
    const navigate = useNavigate();
    

  return <>
    {props.message && <Row><Alert variant={props.message.type} onClose={()=> props.setMessage('')} dismissible>{props.message.msg}</Alert></Row>}
    <h2>Effettua l'accesso</h2>
    <LoginForm handleLogin={props.handleLogin}/>
    <Outlet/>
  </>
}

export default Login;