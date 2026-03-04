import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Typography, Card, CardContent, Button, Grid, Box } from '@mui/material';

export default function Admin() {
  const [reportados, setReportados] = useState([]);

  useEffect(() => {
    cargarReportados();
  }, []);

  const cargarReportados = async () => {
    const res = await api.get('/videojuegos');
    setReportados(res.data.filter(j => j.reportado === true));
  };

  const borrarJuego = async (id) => {
    await api.delete(`/videojuegos/${id}`);
    setReportados(reportados.filter(j => j.id !== id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="error" gutterBottom>Panel de Administrador - Juegos Reportados</Typography>
      {reportados.length === 0 ? <Typography>No hay juegos reportados.</Typography> : (
        <Grid container spacing={3}>
          {reportados.map(juego => (
            <Grid item xs={12} sm={6} md={4} key={juego.id}>
              <Card sx={{ border: '2px solid red' }}>
                <CardContent>
                  <Typography variant="h6">{juego.nombre}</Typography>
                  <Typography variant="body2">{juego.descripcion}</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="error" onClick={() => borrarJuego(juego.id)}>Eliminar Definitivamente</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}