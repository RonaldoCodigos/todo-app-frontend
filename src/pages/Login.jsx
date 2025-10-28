import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importações do Material-UI (Adiciona InputAdornment, IconButton)
import { Container, Box, Typography, TextField, Button, Alert, Link, InputAdornment, IconButton } from '@mui/material';
// Importa os ícones de visibilidade
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  // Funções para alternar a visibilidade
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Impede que o clique tire o foco do input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("[Login.jsx] handleSubmit iniciado."); // Log Adicional

    try {
      // Lê a URL base do apiClient para confirmar
      const baseUrlUsed = apiClient.defaults.baseURL;
      console.log("[Login.jsx] apiClient baseURL:", baseUrlUsed); // Log Adicional
      const loginUrl = '/users/login'; // Endpoint relativo
      console.log("[Login.jsx] Tentando chamar:", `${baseUrlUsed}${loginUrl}`); // Log Adicional

      // Usa apiClient
      const response = await apiClient.post(loginUrl, {
        email: email,
        password: password
      });

      console.log('Login bem-sucedido:', response.data);
      login(response.data.token);
      navigate('/');

    } catch (err) {
      console.error('[Login.jsx] Erro no login:', err.response?.data?.message || err.message);
      console.error('[Login.jsx] Erro completo:', err);
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
        <Typography component="h1" variant="h5"> Login </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && ( <Alert severity="error" sx={{ width: '100%', mb: 2 }}> {error} </Alert> )}
          <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* === MODIFICAÇÃO AQUI === */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            // Altera o tipo baseado no estado showPassword
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Adiciona o InputAdornment (o container do ícone)
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {/* Muda o ícone baseado no estado */}
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* === FIM DA MODIFICAÇÃO === */}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Entrar </Button>
          <Link component={RouterLink} to="/register" variant="body2"> {"Não tem uma conta? Registre-se"} </Link>
        </Box>
      </Box>
    </Container>
  );
}
export default Login;