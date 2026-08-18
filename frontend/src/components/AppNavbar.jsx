import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AppNavbar(props) {
  const navigate = useNavigate();
 // console.log('user:'+props.userid);


  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Concorso Fotografico
        </Navbar.Brand>
        <Nav className="ms-auto">
          {props.loggedin && (
            <>
              <Button variant="outline-light" onClick={props.handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
