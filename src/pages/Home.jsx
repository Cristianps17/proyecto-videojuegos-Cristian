import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, 
  TextField, FormControlLabel, Checkbox, Paper, Box, Chip, Skeleton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert // IMPORTAMOS LOS NUEVOS COMPONENTES
} from '@mui/material';

export default function Home() {
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [nuevoJuego, setNuevoJuego] = useState({ nombre: '', descripcion: '', precio: '', imagen: '' });

  // ESTADO PARA EL MENSAJE DE FEEDBACK (SNACKBAR)
  const [mensaje, setMensaje] = useState({ open: false, texto: '', tipo: 'success' });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [resJuegos, resCats] = await Promise.all([api.get('/videojuegos'), api.get('/categorias')]);
      setJuegos(resJuegos.data);
      setCategorias(resCats.data);
      setCatsSeleccionadas(resCats.data.map(c => c.nombre));
    } catch (error) { console.error(error); } finally { setCargando(false); }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ open: true, texto, tipo });
  };

  const borrarJuego = async (id) => {
    if (!window.confirm("¿Confirmar eliminación?")) return;
    try {
      await api.delete(`/videojuegos/${id}`);
      setJuegos(juegos.filter(j => j.id !== id));
      mostrarMensaje("Juego eliminado correctamente", "error"); // Feedback Rojo
    } catch (error) { alert("Error al borrar."); }
  };

  const crearJuego = async () => {
    if (!nuevoJuego.nombre || !nuevoJuego.precio) return alert("Faltan datos");
    try {
      const juegoFinal = {
        ...nuevoJuego, id: Date.now().toString(), precio: Number(nuevoJuego.precio),
        fechaLanzamiento: new Date().toISOString().split('T')[0], compania: "Indie", plataformas: ["PC"], categorias: ["Aventura"], video: ""
      };
      const res = await api.post('/videojuegos', juegoFinal);
      setJuegos([...juegos, res.data]);
      setOpen(false);
      setNuevoJuego({ nombre: '', descripcion: '', precio: '', imagen: '' });
      mostrarMensaje("¡Juego publicado con éxito!", "success"); // Feedback Verde
    } catch (error) { alert("Error al crear."); }
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
        height: '300px', backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), #121212), url("https://wallpaperaccess.com/full/7445.jpg")',
        backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 4
      }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 900, textShadow: '0 0 20px #7c4dff', textAlign: 'center', px: 2 }}>
          EXPLORA MUNDOS
        </Typography>
        <Button variant="contained" color="secondary" size="large" sx={{ mt: 3, fontWeight: 'bold' }} onClick={() => setOpen(true)}>
          + SUBIR JUEGO
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
          <TextField fullWidth label="Buscar..." variant="outlined" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} sx={{ mb: 2, input: { color: 'white' } }} />
          <Grid container>
            {categorias.map(cat => (
              <Grid item key={cat.id} xs={6} sm={4} md={2}>
                <FormControlLabel control={<Checkbox checked={catsSeleccionadas.includes(cat.nombre)} onChange={() => toggleCat(cat.nombre)} color="secondary" />} label={cat.nombre} />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {cargando ? <Typography>Cargando...</Typography> : juegosFiltrados.map(juego => (
            <Grid item key={juego.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="200" image={juego.imagen || "https://placehold.co/600x400"} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{juego.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">{juego.descripcion.substring(0, 50)}...</Typography>
                  <Chip label={`${juego.precio} €`} color="primary" sx={{ mt: 1 }} />
                </CardContent>
                <Box sx={{ p: 2 }}>
                   <Button variant="contained" color="error" fullWidth onClick={() => borrarJuego(juego.id)}>ELIMINAR</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Nuevo Videojuego</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="Nombre" fullWidth value={nuevoJuego.nombre} onChange={(e) => setNuevoJuego({...nuevoJuego, nombre: e.target.value})} />
            <TextField margin="dense" label="Precio" type="number" fullWidth value={nuevoJuego.precio} onChange={(e) => setNuevoJuego({...nuevoJuego, precio: e.target.value})} />
            <TextField margin="dense" label="Imagen URL" fullWidth value={nuevoJuego.imagen} onChange={(e) => setNuevoJuego({...nuevoJuego, imagen: e.target.value})} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={crearJuego} variant="contained">Publicar</Button>
          </DialogActions>
        </Dialog>

        {/* COMPONENTE DE FEEDBACK (TOAST) */}
        <Snackbar open={mensaje.open} autoHideDuration={4000} onClose={() => setMensaje({...mensaje, open: false})}>
          <Alert onClose={() => setMensaje({...mensaje, open: false})} severity={mensaje.tipo} sx={{ width: '100%' }}>
            {mensaje.texto}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}