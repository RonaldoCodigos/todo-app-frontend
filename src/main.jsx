// ----- DEBUGGING -----
console.log("VITE_API_URL lida em main.jsx:", import.meta.env.VITE_API_URL);
// ----- FIM DEBUGGING -----

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// ... (resto das importações) ...
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; 
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolva o app com o Provedor de Tema */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Garante que o fundo escuro seja aplicado */}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);