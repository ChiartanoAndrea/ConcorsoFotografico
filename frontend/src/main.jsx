import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router';
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={"102222121516-hck8dl13qmutfialcqmkmrvkfaige4u6.apps.googleusercontent.com"}>
      <BrowserRouter >  //TODO: rimettere: basename="/lavori/photo-contest"
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
