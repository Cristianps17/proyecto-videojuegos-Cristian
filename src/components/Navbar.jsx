import { AppBar, Toolbar, Button, Box, Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar>
        {}
        <Button 
            onClick={() => navigate('/')} 
            sx={{ 
                fontWeight: 'bold', 
                fontSize: '1.5rem',
                background: 'linear-gradient(45deg, #7c4dff, #00e5ff)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}
        >
          GAMEZONE
        </Button>
        
        <Box sx={{ flexGrow: 1 }} />

        {!user ? (
          <Button variant="outlined" color="secondary" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                {user.email}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                {user.email[0].toUpperCase()}
            </Avatar>
            <Button color="error" size="small" onClick={logout}>
                Salir
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}