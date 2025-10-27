
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Auth0Provider
        domain={(import.meta.env as any).VITE_AUTH0_DOMAIN}
        clientId={(import.meta.env as any).VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: (import.meta.env as any).VITE_AUTH0_LOGIN_REDIRECT_URL,
        }}
      >
        <App />
      </Auth0Provider>
    </HashRouter>
  </React.StrictMode>
);
