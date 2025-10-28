import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// 1. Importa o NOSSO Provedor de Tema (do ThemeContext)
import { AppThemeProvider } from './context/ThemeContext';

// (Removemos as importações diretas do ThemeProvider, CssBaseline e theme daqui)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Usa o AppThemeProvider para envolver tudo */}
    {/* Ele já inclui o ThemeProvider do MUI, o CssBaseline e a lógica do tema */}
    <AppThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </AppThemeProvider>
  </React.StrictMode>,
);