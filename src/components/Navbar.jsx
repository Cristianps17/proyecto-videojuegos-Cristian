import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estado para el menú desplegable
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        {/* LOGO */}
        <SportsEsportsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold', letterSpacing: '.1rem' }}>
          GAMER LIBRARY
        </Typography>

        <Box>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Registro</Button>
            </>
          ) : (
            <div>
              {/* BOTÓN PERFIL CON MENÚ */}
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ mr: 1 }}/>
                <Typography variant="subtitle1" sx={{fontSize: '0.9rem'}}>
                    {user.email.split('@')[0]}
                </Typography>
              </IconButton>
              
              {/* EL MENÚ DESPLEGABLE DE MUI */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;