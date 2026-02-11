import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, 
  TextField, FormControlLabel, Checkbox, Paper, Box, Chip, Skeleton, Button 
} from '@mui/material';

// FÍJATE: AQUÍ YA NO HAY NINGÚN IMPORT DE ICONOS QUE PUEDA FALLAR

export default function Home() {
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resJuegos, resCats] = await Promise.all([
        api.get('/videojuegos'),
        api.get('/categorias')
      ]);
      setJuegos(resJuegos.data);
      setCategorias(resCats.data);
      setCatsSeleccionadas(resCats.data.map(c => c.nombre));
    } catch (error) { console.error(error); } 
    finally { setCargando(false); }
  };

  const borrarJuego = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este juego?")) return;
    try {
      await api.delete(`/videojuegos/${id}`);
      setJuegos(juegos.filter(j => j.id !== id));
    } catch (error) {
      alert("Error al borrar. ¿Quizás no tienes permisos?");
    }
  };

  const toggleCat = (nombre) => {
    setCatsSeleccionadas(prev => prev.includes(nombre) ? prev.filter(c => c !== nombre) : [...prev, nombre]);
  };

  const juegosFiltrados = juegos.filter(j => 
    (j.nombre.toLowerCase().includes(busqueda.toLowerCase()) || j.descripcion.toLowerCase().includes(busqueda.toLowerCase())) &&
    j.categorias.some(c => catsSeleccionadas.includes(c))
  );

  return (
    <Box>
      <Box sx={{ 
        height: '300px', 
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), #121212), url("https://wallpaperaccess.com/full/7445.jpg")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 4
      }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 900, textShadow: '0 0 20px #7c4dff', textAlign: 'center', px: 2 }}>
          EXPLORA MUNDOS
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
          <TextField 
            fullWidth label="¿Qué buscas hoy?" variant="outlined" 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' } }}
          />
          <Grid container>
            {categorias.map(cat => (
              <Grid item key={cat.id} xs={6} sm={4} md={2}>
                <FormControlLabel
                  control={<Checkbox checked={catsSeleccionadas.includes(cat.nombre)} onChange={() => toggleCat(cat.nombre)} color="secondary" />}
                  label={cat.nombre}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {cargando ? Array.from(new Array(6)).map((_, i) => (
             <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={300} sx={{borderRadius: 2}} /></Grid>
          )) : juegosFiltrados.map(juego => (
            <Grid item key={juego.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <CardMedia component="img" height="200" image={juego.imagen} alt={juego.nombre} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="h6" fontWeight="bold">{juego.nombre}</Typography>
                    <Chip label={`${juego.precio} €`} color="primary" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {juego.descripcion.substring(0, 80)}...
                  </Typography>
                  <Box>
                    {juego.plataformas.map(p => (
                      <Chip key={p} label={p} size="small" sx={{ mr: 0.5, mb: 0.5, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </Box>
                </CardContent>
                
                {/* BOTÓN DE TEXTO SIN ICONO - ESTO NO FALLA */}
                <Box sx={{ p: 2 }}>
                   <Button 
                     variant="contained" 
                     color="error" 
                     fullWidth
                     onClick={() => borrarJuego(juego.id)}
                   >
                      ELIMINAR JUEGO
                   </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}