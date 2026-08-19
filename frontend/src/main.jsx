import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router';
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '102222121516-hck8dl13qmutfialcqmkmrvkfaige4u6.apps.googleusercontent.com';
//basename="/lavori/photo-contest"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter basename="/lavori/photo-contest"> 
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
