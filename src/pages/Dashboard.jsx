import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig'; // 1. Importa o apiClient configurado

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
  const { logout } = useAuth(); // (Não precisamos do userToken diretamente aqui)
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados de Notificação e Modais (continuam iguais)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [newText, setNewText] = useState(''); 

  // 2. REMOVEMOS a função getAuthConfig() - o apiClient faz isso!

  // --- Efeito: Carregar Tarefas ---
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        // 3. USA apiClient (já tem a baseURL e o token)
        const response = await apiClient.get('/todos'); 
        setTodos(response.data);
      } catch (err) {
        setSnackbar({ open: true, message: 'Erro ao carregar tarefas.', severity: 'error' });
        console.error("Erro fetchTodos:", err); // Log mais detalhado
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []); // Roda só uma vez

  // --- Função: Criar nova tarefa ---
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      // 4. USA apiClient
      const response = await apiClient.post('/todos', { text });
      setTodos([response.data, ...todos]);
      setText('');
      setSnackbar({ open: true, message: 'Tarefa adicionada com sucesso!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao criar tarefa.', severity: 'error' });
      console.error("Erro handleCreateTodo:", err);
    }
  };

  // --- Funções: Deletar Tarefa ---
  const handleOpenDeleteDialog = (id) => { /* ... (código igual) ... */ setTodoToDelete(id); setOpenDeleteDialog(true); };
  const handleCloseDeleteDialog = () => { /* ... (código igual) ... */ setOpenDeleteDialog(false); setTodoToDelete(null); };
  const handleConfirmDelete = async () => {
    try {
      // 5. USA apiClient
      await apiClient.delete(`/todos/${todoToDelete}`);
      setTodos(todos.filter((todo) => todo._id !== todoToDelete));
      setSnackbar({ open: true, message: 'Tarefa deletada com sucesso!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao deletar tarefa.', severity: 'error' });
      console.error("Erro handleConfirmDelete:", err);
    } finally {
      handleCloseDeleteDialog();
    }
  };
  
  // --- Funções: Editar Tarefa (Modal) ---
  const handleOpenEditDialog = (todo) => { /* ... (código igual) ... */ setTodoToEdit(todo); setNewText(todo.text); setOpenEditDialog(true); };
  const handleCloseEditDialog = () => { /* ... (código igual) ... */ setOpenEditDialog(false); setTodoToEdit(null); setNewText(''); };
  const handleConfirmEdit = async () => {
    try {
      // 6. USA apiClient
      const response = await apiClient.put(`/todos/${todoToEdit._id}`, { text: newText });
      setTodos(todos.map(todo => 
        todo._id === todoToEdit._id ? response.data : todo
      ));
      setSnackbar({ open: true, message: 'Tarefa atualizada com sucesso!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao atualizar tarefa.', severity: 'error' });
      console.error("Erro handleConfirmEdit:", err);
    } finally {
      handleCloseEditDialog();
    }
  };

  // --- Função: Marcar como Concluído (Checkbox) ---
  const handleToggleComplete = async (todo) => {
    try {
      // 7. USA apiClient
      const response = await apiClient.put(`/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map(t => 
        t._id === todo._id ? response.data : t
      ));
      // Opcional: Snackbar para sucesso no toggle
      // setSnackbar({ open: true, message: 'Status atualizado!', severity: 'info' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao atualizar status.', severity: 'error' });
      console.error("Erro handleToggleComplete:", err);
    }
  };

  // --- Funções de UI (Snackbar e Logout) ---
  const handleSnackbarClose = (event, reason) => { /* ... (código igual) ... */ if (reason === 'clickaway') return; setSnackbar({ ...snackbar, open: false }); };
  const handleLogout = () => logout();

  // --- Renderização ---
  // (O JSX continua exatamente o mesmo da versão anterior com Material UI)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
          {/* ... (AppBar JSX) ... */}
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
            {/* ... (Formulário JSX) ... */}
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
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>{/* ... */}</Snackbar>

    </Box>
  );
}

export default Dashboard;