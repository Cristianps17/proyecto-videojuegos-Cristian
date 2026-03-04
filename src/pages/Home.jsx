import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, TextField, 
  Box, Chip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Snackbar, Alert, Pagination, 
  Select, MenuItem, IconButton, Fab, Divider, List, ListItem, ListItemText
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState('defecto');
  const [paginaActual, setPaginaActual] = useState(1);
  const [juegosPorPagina, setJuegosPorPagina] = useState(6);
  const [comentarioTexto, setComentarioTexto] = useState("");
  
  // IA State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatRespuestas, setChatRespuestas] = useState([]);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const [resJuegos, resCats] = await Promise.all([api.get('/videojuegos'), api.get('/categorias')]);
    setJuegos(resJuegos.data);
    setCategorias(resCats.data);
  };

  const votarJuego = async (juego, tipoVoto) => {
    let likes = juego.likes || []; let dislikes = juego.dislikes || [];
    likes = likes.filter(id => id !== user.id); dislikes = dislikes.filter(id => id !== user.id);
    if (tipoVoto === 'like') likes.push(user.id); else dislikes.push(user.id);
    const res = await api.patch(`/videojuegos/${juego.id}`, { likes, dislikes });
    setJuegos(juegos.map(j => j.id === juego.id ? res.data : j));
  };

  const reportarJuego = async (juego) => {
    const res = await api.patch(`/videojuegos/${juego.id}`, { reportado: true });
    setJuegos(juegos.map(j => j.id === juego.id ? res.data : j));
    alert("Juego reportado al administrador.");
  };

  const enviarComentario = async (juego) => {
    if(!comentarioTexto) return;
    const nuevoComentario = { id: Date.now(), userId: user.id, email: user.email, texto: comentarioTexto };
    const comentariosActuales = juego.comentarios || [];
    const res = await api.patch(`/videojuegos/${juego.id}`, { comentarios: [...comentariosActuales, nuevoComentario] });
    setJuegos(juegos.map(j => j.id === juego.id ? res.data : j));
    setComentarioTexto("");
  };

  const borrarComentario = async (juego, comentarioId) => {
    const comentariosFiltrados = juego.comentarios.filter(c => c.id !== comentarioId);
    const res = await api.patch(`/videojuegos/${juego.id}`, { comentarios: comentariosFiltrados });
    setJuegos(juegos.map(j => j.id === juego.id ? res.data : j));
  };

  const preguntarIA = async () => {
    if(!chatInput) return;
    const nuevoMensaje = { rol: 'user', texto: chatInput };
    setChatRespuestas([...chatRespuestas, nuevoMensaje]);
    setChatInput("");
    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'lfm2.5-thinking', prompt: `Eres un experto en videojuegos. Responde a esto sobre nuestro catálogo: ${chatInput}`, stream: false })
      });
      const data = await res.json();
      setChatRespuestas(prev => [...prev, { rol: 'ia', texto: data.response }]);
    } catch(e) {
      setChatRespuestas(prev => [...prev, { rol: 'ia', texto: "Error de conexión con Ollama. ¿Está el contenedor Docker encendido?" }]);
    }
  };

  let juegosProcesados = juegos.filter(j => j.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  if (orden === 'popularidad') juegosProcesados.sort((a, b) => ((b.likes?.length||0)-(b.dislikes?.length||0)) - ((a.likes?.length||0)-(a.dislikes?.length||0)));
  const juegosPaginados = juegosProcesados.slice((paginaActual - 1) * juegosPorPagina, paginaActual * juegosPorPagina);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative', minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Select value={orden} onChange={(e) => setOrden(e.target.value)} size="small" sx={{bgcolor: 'background.paper'}}>
          <MenuItem value="defecto">Orden por defecto</MenuItem>
          <MenuItem value="popularidad">Más Populares</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        {juegosPaginados.map(juego => (
          <Grid item key={juego.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia component="img" height="150" image={juego.imagen || "https://placehold.co/600"} />
              <CardContent>
                <Typography variant="h6">{juego.nombre} <Chip label={`${juego.precio}€`} size="small"/></Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <IconButton color="success" onClick={() => votarJuego(juego, 'like')}><ThumbUpIcon fontSize="small"/> {juego.likes?.length||0}</IconButton>
                  <IconButton color="error" onClick={() => votarJuego(juego, 'dislike')}><ThumbDownIcon fontSize="small"/> {juego.dislikes?.length||0}</IconButton>
                  <IconButton color="warning" onClick={() => reportarJuego(juego)} title="Reportar"><ReportProblemIcon fontSize="small"/></IconButton>
                </Box>
                <Divider sx={{my:1}}/>
                <Typography variant="caption">Comentarios:</Typography>
                <List dense>
                  {(juego.comentarios || []).map(c => (
                    <ListItem key={c.id} secondaryAction={ (user?.email === 'admin@test.com' || user?.id === c.userId) && <IconButton edge="end" size="small" color="error" onClick={()=>borrarComentario(juego, c.id)}><DeleteIcon fontSize="small"/></IconButton> }>
                      <ListItemText primary={c.texto} secondary={c.email.split('@')[0]} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField size="small" fullWidth placeholder="Comentar..." value={comentarioTexto} onChange={e=>setComentarioTexto(e.target.value)} />
                  <Button variant="contained" onClick={() => enviarComentario(juego)}>+</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination count={Math.ceil(juegosProcesados.length/juegosPorPagina)} page={paginaActual} onChange={(e,v)=>setPaginaActual(v)} sx={{mt:3, display:'flex', justifyContent:'center'}} />

      <Fab color="secondary" sx={{ position: 'fixed', bottom: 20, right: 20 }} onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>

      {chatOpen && (
        <Paper elevation={10} sx={{ position: 'fixed', bottom: 90, right: 20, width: 350, height: 450, display: 'flex', flexDirection: 'column', p: 2, zIndex: 1000 }}>
          <Typography variant="h6" color="secondary" gutterBottom>Asistente IA</Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1, bgcolor: '#1e1e1e', borderRadius: 1 }}>
            {chatRespuestas.map((msg, i) => (
              <Typography key={i} align={msg.rol === 'user' ? 'right' : 'left'} color={msg.rol === 'user' ? 'primary' : 'white'} sx={{mb:1, fontSize:'0.9rem'}}>
                <strong>{msg.rol === 'user' ? 'Tú: ' : 'IA: '}</strong>{msg.texto}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Pregunta sobre juegos..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && preguntarIA()}/>
            <Button variant="contained" onClick={preguntarIA}>Enviar</Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
}