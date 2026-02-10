import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, FormControlLabel, Checkbox, Paper, Box, Chip, Skeleton } from '@mui/material';

export default function Home() {
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true); // Efecto de carga
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
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
    cargarDatos();
  }, []);

  const toggleCat = (nombre) => {
    setCatsSeleccionadas(prev => prev.includes(nombre) ? prev.filter(c => c !== nombre) : [...prev, nombre]);
  };

  const juegosFiltrados = juegos.filter(j => 
    (j.nombre.toLowerCase().includes(busqueda.toLowerCase()) || j.descripcion.toLowerCase().includes(busqueda.toLowerCase())) &&
    j.categorias.some(c => catsSeleccionadas.includes(c))
  );

  return (
    <Box>
      {/* HERO BANNER (Esto le da el toque PRO) */}
      <Box sx={{ 
        height: '300px', 
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), #121212), url("https://wallpaperaccess.com/full/7445.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mb: 4
      }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 900, textShadow: '0 0 20px #7c4dff' }}>
          EXPLORA MUNDOS
        </Typography>
        <Typography variant="h5" sx={{ color: '#00e5ff', mt: 1 }}>
          Tu colección definitiva v2
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        {/* FILTROS */}
        <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
          <TextField 
            fullWidth label="¿Qué buscas hoy?" variant="outlined" 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            sx={{ mb: 2 }}
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

        {/* GRID DE JUEGOS */}
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}