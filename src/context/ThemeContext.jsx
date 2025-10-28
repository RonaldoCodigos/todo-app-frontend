import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';

// Cria o Contexto
const ThemeContext = createContext({
  toggleThemeMode: () => {}, // Função vazia como padrão
  mode: 'light', // Modo padrão
});

// Função para criar o tema MUI (baseado no modo)
const getMuiTheme = (mode) =>
  createTheme({
    palette: {
      mode, // 'light' ou 'dark'
      // ... (você pode adicionar suas cores primárias/secundárias aqui se quiser)
    },
  });

// Cria o Provedor do Contexto
export function AppThemeProvider({ children }) {
  // 1. Detecta preferência do sistema
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // 2. Estado para o modo atual ('light' ou 'dark')
  //    Tenta ler do localStorage, senão usa a preferência do sistema
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  // 3. Efeito para salvar no localStorage quando o modo mudar
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // 4. Função para alternar o modo
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // 5. Cria o tema MUI dinamicamente (usando useMemo para otimização)
  const theme = useMemo(() => getMuiTheme(mode), [mode]);

  // 6. Valor a ser compartilhado pelo contexto
  const contextValue = useMemo(() => ({ toggleThemeMode, mode }), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Aplica o tema MUI */}
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Normaliza CSS e aplica fundo */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

// Hook customizado para usar o contexto facilmente
export const useAppTheme = () => useContext(ThemeContext);