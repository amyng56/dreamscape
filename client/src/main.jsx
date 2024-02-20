import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext'

import App from './App.jsx'
import './index.css'
import { QueryProvider } from "@/lib/react-query/QueryProvider";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode >,
)
