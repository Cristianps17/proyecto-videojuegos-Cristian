import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { CssBaseline } from '@mui/material'; // Esto resetea el CSS del navegador

function App() {
  return (
    <>
      <CssBaseline /> {/* Normaliza estilos y pone fondo bonito */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;