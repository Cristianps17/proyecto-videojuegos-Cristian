import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError('Error al registrar. Puede que el usuario ya exista.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(30, 30, 30, 0.9)' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2, color: 'secondary.main' }}>
          CREAR CUENTA
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth
            label="Correo Electrónico"
            type="email"
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
          
          <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
            REGISTRARSE
          </Button>
          
          <Box textAlign="center">
            <Link to="/login" style={{ textDecoration: 'none', color: '#7c4dff' }}>
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}