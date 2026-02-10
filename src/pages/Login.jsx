import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(30, 30, 30, 0.9)' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          INICIAR SESIÓN
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth
            label="Correo Electrónico"
            autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
          <TextField
            margin="normal" required fullWidth
            label="Contraseña"
            type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            sx={{ input: { color: 'white' } }}
          />
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
            ENTRAR
          </Button>
          
          <Box textAlign="center">
            <Link to="/register" style={{ textDecoration: 'none', color: '#00e5ff' }}>
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}