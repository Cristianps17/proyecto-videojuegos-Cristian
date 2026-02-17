import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Paper, TextField, Button, Typography, Box, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email'; // Icono Email
import LockIcon from '@mui/icons-material/Lock';   // Icono Candado

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError("Email o contraseña incorrectos.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={10} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          INICIAR SESIÓN
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 1, width: '100%', bgcolor: '#ffcdd2', color: '#c62828', borderRadius: 1, textAlign: 'center' }}>
            {error}
          </Box>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          {/* INPUT CON ICONO DE EMAIL */}
          <TextField
            margin="normal" required fullWidth label="Correo Electrónico" autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          {/* INPUT CON ICONO DE CANDADO */}
          <TextField
            margin="normal" required fullWidth label="Contraseña" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}>
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

export default Login;