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
  const { logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [newText, setNewText] = useState('');

  // --- Efeito: Carregar Tarefas ---
  useEffect(() => {
    const fetchTodos = async () => { /* ... (código igual) ... */ };
    fetchTodos();
  }, []);

  // --- Função: Criar nova tarefa ---
  const handleCreateTodo = async (e) => { /* ... (código igual) ... */ };

  // --- Funções: Deletar Tarefa ---
  const handleOpenDeleteDialog = (id) => {
    // ---- LOG 1: Confirma que o clique chamou a função ----
    console.log("[handleOpenDeleteDialog] Chamada com ID:", id); 
    setTodoToDelete(id);
    setOpenDeleteDialog(true);
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


  // ---- LOG 2: Mostra o valor do estado ANTES da renderização ----
  console.log("[Dashboard Render] Estado openDeleteDialog:", openDeleteDialog);


  // --- Renderização ---
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

      {/* Modal de Delete */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir esta tarefa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Excluir</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>{/* ... */}</Dialog>

      {/* Snackbar de Notificação */}
      <Snackbar
         open={snackbar.open}
         autoHideDuration={10000} // Mantém 10s para debug
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