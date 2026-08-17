import { useState } from "react";
import { Button, Col, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';


function LoginForm(props) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');

    const handleSocialLogin = async (provider) => {
        setIsPending(true);
        setError('');

        try {
            await props.handleLogin({ provider });
        } catch (error) {
            setError(`Login con ${provider} fallito.`);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            {isPending && <Alert variant="warning">Attendi mentre completiamo il login...</Alert>}
            <Row className="justify-content-center mt-5">
                <Col md={12}>
                    <div className="p-4 shadow-lg rounded-4 bg-light">
                        <h2 className="text-center mb-4">Accedi</h2>
                        <p className="text-center text-muted mb-4">Fai l'accesso con Google</p>

                        <div className="d-grid gap-3">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log("Token ricevuto da Google:", credentialResponse);
                                    // Passa il token JWT (credential) alla tua funzione handleLogin
                                    props.handleLogin({
                                        provider: 'google',
                                        token: credentialResponse.credential // <-- Questo è fondamentale!
                                    });
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                    setError('Login con Google fallito.');
                                }}
                            />
                        </div>

                        {error && <p className="text-danger mt-3 text-center">{error}</p>}

                        <div className="d-flex justify-content-between mt-4">
                            <Link className="btn btn-danger" to="/" disabled={isPending}>
                                Annulla
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )


}

function LogoutButton(props) {
    return (
        <Button variant='outline-light' onClick={props.handleLogout}>Logout</Button>
    )
}










export { LoginForm, LogoutButton};

