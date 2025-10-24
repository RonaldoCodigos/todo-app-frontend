// Em: src/pages/Login.jsx
// VERSÃO DE TESTE FINAL (Axios direto no componente)

import { useState } from 'react';
import axios from 'axios'; // Importa o axios DIRETAMENTE aqui
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Mantém este import para a função login()

// Importações do Material-UI
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Pega a função login do contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // --- TESTE RADICAL ---
      // 1. Lê a variável de ambiente AQUI DENTRO
      const apiUrlFromEnv = import.meta.env.VITE_API_URL;
      console.log("[Login.jsx] API URL lida:", apiUrlFromEnv); // Log de Debug

      // 2. Monta a URL completa AQUI DENTRO
      //    (Certifique-se que apiUrlFromEnv NÃO termina com / e que adicionamos /api)
      const loginUrl = `${apiUrlFromEnv}/api/users/login`;
      console.log("[Login.jsx] Tentando chamar:", loginUrl); // Log de Debug

      // 3. Faz a chamada axios básica (sem apiClient)
      const response = await axios.post(loginUrl, {
        email: email,
        password: password
      });
      // --- FIM TESTE RADICAL ---

      console.log('Login bem-sucedido:', response.data);
      login(response.data.token);
      navigate('/');

    } catch (err) {
      // Mantém o tratamento de erro, adiciona mais logs
      console.error('[Login.jsx] Erro no login:', err.response?.data?.message || err.message); // Log de Debug
      console.error('[Login.jsx] Erro completo:', err); // Log de Debug
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  // O return com o JSX do Material UI continua o mesmo
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>

          <Link component={RouterLink} to="/register" variant="body2">
            {"Não tem uma conta? Registre-se"}
          </Link>

        </Box>
      </Box>
    </Container>
  );
}

export default Login;