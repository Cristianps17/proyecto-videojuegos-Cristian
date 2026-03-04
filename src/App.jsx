import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin'; // NUEVO

const RutaPrivada = ({ children, requiereAdmin }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiereAdmin && user.email !== 'admin@test.com') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RutaPrivada><Home /></RutaPrivada>} />
            <Route path="/admin" element={<RutaPrivada requiereAdmin={true}><Admin /></RutaPrivada>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;