import { useState, useEffect } from 'react';
import api from '../api/axios'; // Usamos axios, más limpio
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, 
  TextField, FormControlLabel, Checkbox, Paper, Box, Chip 
} from '@mui/material';

export default function Home() {
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  
  // Filtros
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Carga de datos inicial (Más limpia con axios)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resJuegos, resCats, resPlats] = await Promise.all([
          api.get('/videojuegos'),
          api.get('/categorias'),
          api.get('/plataformas')
        ]);
        setJuegos(resJuegos.data);
        setCategorias(resCats.data);
        setPlataformas(resPlats.data);
        
        // Activar filtros por defecto
        setCatsSeleccionadas(resCats.data.map(c => c.nombre));
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    cargarDatos();
  }, []);

  // Lógica de filtrado
  const toggleCat = (nombre) => {
    setCatsSeleccionadas(prev => 
      prev.includes(nombre) ? prev.filter(c => c !== nombre) : [...prev, nombre]
    );
  };

  const juegosFiltrados = juegos.filter(juego => {
    const cumpleBusqueda = juego.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                           juego.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCat = juego.categorias.some(c => catsSeleccionadas.includes(c));
    return cumpleBusqueda && cumpleCat;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Catálogo V2
      </Typography>

      {/* ZONA DE FILTROS (Paper le da efecto de sombra elevado) */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <TextField 
          fullWidth 
          label="Buscar videojuego..." 
          variant="outlined" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Filtrar por Categoría:
        </Typography>
        <Grid container>
          {categorias.map(cat => (
            <Grid item key={cat.id} xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={catsSeleccionadas.includes(cat.nombre)}
                    onChange={() => toggleCat(cat.nombre)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{cat.nombre}</Typography>}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* GRID DE JUEGOS (Responsive automático) */}
      <Grid container spacing={3}>
        {juegosFiltrados.map(juego => (
          <Grid item key={juego.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
              <CardMedia
                component="img"
                height="180"
                image={juego.imagen || "https://placehold.co/600x400"}
                alt={juego.nombre}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {juego.nombre}
                  </Typography>
                  <Chip label={`${juego.precio} €`} color="success" size="small" />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {juego.descripcion.substring(0, 100)}...
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                    {juego.plataformas.map(p => (
                        <Chip key={p} label={p} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }} />
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}