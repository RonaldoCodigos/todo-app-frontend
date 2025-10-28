import { useState, useEffect } from 'react'; // 1. Adiciona useEffect
import apiClient from '../api/axiosConfig';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importações do Material-UI (Adiciona FormControlLabel, Checkbox)
import { Container, Box, Typography, TextField, Button, Alert, Link, InputAdornment, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// 2. Chave para salvar o e-mail no localStorage
const REMEMBER_ME_KEY = 'rememberedEmail';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // 3. Novo estado para o Checkbox "Lembrar-me"
  const [rememberMe, setRememberMe] = useState(false); 

  // 4. Efeito que roda UMA VEZ ao carregar o componente
  useEffect(() => {
    // Verifica se há um e-mail salvo no localStorage
    const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
    if (rememberedEmail) {
      setEmail(rememberedEmail); // Preenche o campo de e-mail
      setRememberMe(true);     // Marca o checkbox
    }
  }, []); // Array vazio significa "rodar só na montagem"

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // 5. Atualiza o estado do checkbox quando clicado
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await apiClient.post('/users/login', { email, password });
      
      // 6. Lógica do "Lembrar-me" APÓS o login bem-sucedido
      if (rememberMe) {
        // Se marcado, salva o e-mail atual no localStorage
        localStorage.setItem(REMEMBER_ME_KEY, email);
      } else {
        // Se desmarcado, remove qualquer e-mail salvo anteriormente
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
      
      login(response.data.token);
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
      console.error('Erro no login:', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
        <Typography component="h1" variant="h5"> Login </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && ( <Alert severity="error" sx={{ width: '100%', mb: 2 }}> {error} </Alert> )}
          <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: ( <InputAdornment position="end"> <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ),
            }}
          />

          {/* 7. Checkbox "Lembrar-me" adicionado aqui */}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" checked={rememberMe} onChange={handleRememberMeChange} />}
            label="Lembrar meu e-mail"
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Entrar </Button>
          <Link component={RouterLink} to="/register" variant="body2"> {"Não tem uma conta? Registre-se"} </Link>
        </Box>
      </Box>
    </Container>
  );
}
export default Login;