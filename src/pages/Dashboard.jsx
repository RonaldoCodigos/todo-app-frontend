// Em: src/pages/Dashboard.jsx
// VERSÃO COM LOGS DETALHADOS NO USEEFFECT

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';

// Importações do Material-UI
import {
  Container, Box, Typography, TextField, Button, List, ListItem,
  ListItemText, IconButton, AppBar, Toolbar, Alert, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';

function Dashboard() {
  const { logout } = useAuth(); // Pegamos userToken DENTRO do useEffect agora
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true); // Começa carregando
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [newText, setNewText] = useState('');

  // --- Efeito: Carregar Tarefas (COM MAIS LOGS) ---
  useEffect(() => {
    // Pegamos o token do localStorage AQUI DENTRO para ter certeza
    const currentToken = localStorage.getItem('token');
    console.log("[Dashboard useEffect] Iniciando. Token atual:", currentToken ? "Existe" : "NÃO Existe"); // Log A

    const fetchTodos = async () => {
      // Verifica se temos um token ANTES de tentar
      if (!currentToken) {
        console.log("[Dashboard useEffect] Token NÃO disponível no início. Abortando fetch."); // Log B
        setLoading(false); // Para o spinner se não houver token
        return;
      }

      try {
        console.log("[Dashboard useEffect] Token disponível. Setando loading=true..."); // Log C
        setLoading(true); // Garante que loading está true ANTES da chamada

        console.log("[Dashboard useEffect] Fazendo chamada GET /todos..."); // Log D
        // Passa a configuração do token manualmente para ter certeza
        const config = { headers: { Authorization: `Bearer ${currentToken}` } };
        const response = await apiClient.get('/todos', config);
        console.log("[Dashboard useEffect] Chamada GET /todos BEM-SUCEDIDA. Resposta:", response.data); // Log E

        setTodos(response.data); // Salva as tarefas
        console.log("[Dashboard useEffect] Estado 'todos' atualizado."); // Log F

      } catch (err) {
        setSnackbar({ open: true, message: 'Erro ao carregar tarefas.', severity: 'error' });
        console.error("[Dashboard useEffect] ERRO na chamada GET /todos:", err); // Log G (ERRO!)
        // Log detalhado do erro de rede, se houver
        if (err.response) {
          console.error("[Dashboard useEffect] Erro - Status:", err.response.status);
          console.error("[Dashboard useEffect] Erro - Data:", err.response.data);
        } else if (err.request) {
          console.error("[Dashboard useEffect] Erro - Sem resposta:", err.request);
        } else {
          console.error("[Dashboard useEffect] Erro - Configuração:", err.message);
        }
      } finally {
        console.log("[Dashboard useEffect] Entrando no finally. Setando loading=false..."); // Log H
        setLoading(false); // Para o spinner
        console.log("[Dashboard useEffect] Finalizado."); // Log I
      }
    };

    fetchTodos();
    // Roda apenas uma vez quando o componente monta
  }, []); // Array de dependências vazio

  // --- Função: Criar nova tarefa ---
  const handleCreateTodo = async (e) => { /* ... (código igual) ... */ };

  // --- Funções: Deletar Tarefa ---
  const handleOpenDeleteDialog = (id) => {
    console.log("[handleOpenDeleteDialog] Chamada com ID:", id); // Mantém log de delete
    setTodoToDelete(id); setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => { /* ... (código igual) ... */ setOpenDeleteDialog(false); setTodoToDelete(null); };
  const handleConfirmDelete = async () => { /* ... (código igual) ... */ };

  // --- Funções: Editar Tarefa (Modal) ---
  const handleOpenEditDialog = (todo) => { /* ... (código igual) ... */ };
  const handleCloseEditDialog = () => { /* ... (código igual) ... */ };
  const handleConfirmEdit = async () => { /* ... (código igual) ... */ };

  // --- Função: Marcar como Concluído (Checkbox) ---
  const handleToggleComplete = async (todo) => { /* ... (código igual) ... */ };

  // --- Funções de UI (Snackbar e Logout) ---
  const handleSnackbarClose = (event, reason) => { /* ... (código igual) ... */ };
  const handleLogout = () => logout();

  console.log("[Dashboard Render] Estado openDeleteDialog:", openDeleteDialog); // Mantém log de delete

  // --- Renderização ---
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
          {/* ... (AppBar JSX continua igual) ... */}
         <Toolbar>
           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             Minhas Tarefas
           </Typography>
           <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
             Sair
           </Button>
         </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Box component="form" onSubmit={handleCreateTodo} sx={{ display: 'flex', gap: 2, mb: 4 }}>
            {/* ... (Formulário JSX continua igual) ... */}
           <TextField
             fullWidth
             variant="outlined"
             label="Adicionar nova tarefa..."
             value={text}
             onChange={(e) => setText(e.target.value)}
           />
           <Button type="submit" variant="contained" size="large">
             Adicionar
           </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {todos.length === 0 && (
              <Typography align="center">
                Nenhuma tarefa encontrada. Crie sua primeira tarefa!
              </Typography>
            )}
            {todos.map((todo) => (
              <ListItem
                key={todo._id}
                divider
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditDialog(todo)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(todo._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  tabIndex={-1}
                />
                <ListItemText
                  primary={todo.text}
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>

      {/* Modais e Snackbar (JSX continua igual) */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>{/* ... */}</Dialog>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>{/* ... */}</Dialog>
      <Snackbar
         open={snackbar.open}
         autoHideDuration={10000}
         onClose={handleSnackbarClose}
         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
       >
         <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
           {snackbar.message}
         </Alert>
       </Snackbar>

    </Box>
  );
}

export default Dashboard;