import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';

// Importações do Material-UI (Adiciona InputAdornment, IconButton)
import { Container, Box, Typography, TextField, Button, Alert, Link, InputAdornment, IconButton } from '@mui/material';
// Importa os ícones de visibilidade
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {
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

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Usa apiClient
      const response = await apiClient.post('/users/register', {
        email: email,
        password: password
      });

      console.log('Usuário registrado:', response.data);
      login(response.data.token);
      navigate('/');

    } catch (err) {
      console.error('Erro no registro:', err.response?.data?.message);
      setError(err.response?.data?.message || 'Erro ao registrar.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
        <Typography component="h1" variant="h5"> Registrar Nova Conta </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && ( <Alert severity="error" sx={{ width: '100%', mb: 2 }}> {error} </Alert> )}
          <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* === MODIFICAÇÃO AQUI === */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha (mínimo 6 caracteres)"
             // Altera o tipo baseado no estado showPassword
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password" // Mudou para "new-password"
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Registrar </Button>
          <Link component={RouterLink} to="/login" variant="body2"> {"Já tem uma conta? Faça Login"} </Link>
        </Box>
      </Box>
    </Container>
  );
}
export default Register;