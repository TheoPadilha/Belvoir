import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from './router';

// Google OAuth Client ID - substituir pelo Client ID real em produção
// Para obter: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
