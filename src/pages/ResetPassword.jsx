import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importações do Material-UI
import { Container, Box, Typography, TextField, Button, Alert, Link, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { token } = useParams();

  // Estados e funções para visualizar senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event) => event.preventDefault();

  // Verifica se o token existe na URL ao carregar
  useEffect(() => {
    if (!token) {
      setError('Token de redefinição inválido ou ausente.');
    }
  }, [token]);

  // --- FUNÇÃO COM LOGS DE DIAGNÓSTICO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    console.log("[ResetPassword handleSubmit] Iniciado."); // Log RP1

    // Validações
    if (password !== confirmPassword) {
      console.log("[ResetPassword handleSubmit] Erro: Senhas não coincidem."); // Log RP2
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      console.log("[ResetPassword handleSubmit] Erro: Senha curta."); // Log RP3
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!token) {
      console.log("[ResetPassword handleSubmit] Erro: Token ausente."); // Log RP4
      setError('Token de redefinição inválido ou ausente.');
      return;
    }

    setLoading(true);
    console.log("[ResetPassword handleSubmit] Setou loading=true."); // Log RP5

    try {
      const resetUrl = `/users/reset-password/${token}`;
      console.log("[ResetPassword handleSubmit] Tentando chamar apiClient.patch para:", resetUrl); // Log RP6

      // Chama a API PATCH do back-end
      const response = await apiClient.patch(resetUrl, {
        password: password // Envia apenas a nova senha no corpo
      });

      console.log("[ResetPassword handleSubmit] Chamada PATCH bem-sucedida:", response.data); // Log RP7
      setMessage(response.data.message || 'Senha redefinida com sucesso!');

      if (response.data.token) {
        console.log("[ResetPassword handleSubmit] Logando usuário com novo token..."); // Log RP8
        login(response.data.token);
      }

      console.log("[ResetPassword handleSubmit] Agendando redirecionamento..."); // Log RP9
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('[ResetPassword handleSubmit] ERRO no catch:', err); // Log RP10 (ERRO!)
      if (err.response) { console.error("[ResetPassword handleSubmit] Erro - Status:", err.response.status); console.error("[ResetPassword handleSubmit] Erro - Data:", err.response.data); }
      else if (err.request) { console.error("[ResetPassword handleSubmit] Erro - Sem resposta:", err.request); }
      else { console.error("[ResetPassword handleSubmit] Erro - Configuração:", err.message); }
      setError(err.response?.data?.message || 'Erro ao redefinir a senha.');
    } finally {
      console.log("[ResetPassword handleSubmit] Entrando no finally. Setando loading=false..."); // Log RP11
      setLoading(false);
      console.log("[ResetPassword handleSubmit] Finalizado."); // Log RP12
    }
  };
  // --- FIM DA FUNÇÃO COM LOGS ---

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
          Digite sua Nova Senha
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          
          {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Nova Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !!message}
            InputProps={{
              endAdornment: ( <InputAdornment position="end"> <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Nova Senha"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || !!message}
            InputProps={{
              endAdornment: ( <InputAdornment position="end"> <IconButton aria-label="toggle confirm password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownConfirmPassword} edge="end"> {showConfirmPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !!message}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Redefinir Senha'}
          </Button>

          {!message && (
             <Link component={RouterLink} to="/login" variant="body2">
               {"Voltar para Login"}
             </Link>
          )}

        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;