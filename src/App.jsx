import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Datos
  const [juegos, setJuegos] = useState([])
  const [listaCategorias, setListaCategorias] = useState([])
  const [listaPlataformas, setListaPlataformas] = useState([])

  // Filtros
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([])
  const [platsSeleccionadas, setPlatsSeleccionadas] = useState([])
  const [busqueda, setBusqueda] = useState("")

  // UI
  const [juegoDetalle, setJuegoDetalle] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  
  // Nuevo Juego
  const [nuevoJuego, setNuevoJuego] = useState({
    nombre: '', descripcion: '', precio: 0, imagen: '', 
    categorias: [], plataformas: [], compania: '', fechaLanzamiento: ''
  })

  // CARGA DE DATOS (BLINDADA)
  useEffect(() => {
    // Hacemos 3 peticiones separadas para asegurar que llega todo
    Promise.all([
      fetch('http://localhost:3000/videojuegos').then(r => r.json()),
      fetch('http://localhost:3000/categorias').then(r => r.json()),
      fetch('http://localhost:3000/plataformas').then(r => r.json())
    ]).then(([datosJuegos, datosCats, datosPlats]) => {
      setJuegos(datosJuegos)
      setListaCategorias(datosCats)
      setListaPlataformas(datosPlats)
      
      // Activar todos los checkboxes al inicio
      setCatsSeleccionadas(datosCats.map(c => c.nombre))
      setPlatsSeleccionadas(datosPlats.map(p => p.nombre))
    }).catch(err => console.error("Error cargando datos:", err))
  }, [])

  // HANDLERS
  const toggleCategoria = (nombre) => {
    setCatsSeleccionadas(prev => prev.includes(nombre) ? prev.filter(c => c !== nombre) : [...prev, nombre])
  }
  const togglePlataforma = (nombre) => {
    setPlatsSeleccionadas(prev => prev.includes(nombre) ? prev.filter(p => p !== nombre) : [...prev, nombre])
  }

  // AÑADIR JUEGO
  const guardarJuego = (e) => {
    e.preventDefault()
    const juegoFinal = { ...nuevoJuego, id: String(Date.now()) }
    
    fetch('http://localhost:3000/videojuegos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(juegoFinal)
    })
    .then(res => res.json())
    .then(data => {
      setJuegos([...juegos, data])
      setMostrarForm(false)
      setNuevoJuego({ nombre: '', descripcion: '', precio: 0, imagen: '', categorias: [], plataformas: [], compania: '', fechaLanzamiento: '' })
    })
  }

  // Helper para select multiple
  const handleMultiSelect = (e, campo) => {
    const values = Array.from(e.target.selectedOptions, option => option.value)
    setNuevoJuego({...nuevoJuego, [campo]: values})
  }

  const borrarJuego = (id) => {
    fetch(`http://localhost:3000/videojuegos/${id}`, { method: 'DELETE' })
      .then(() => {
        setJuegos(juegos.filter(j => j.id !== id))
        setJuegoDetalle(null)
      })
  }

  // FILTRADO
  const juegosFiltrados = juegos.filter(juego => {
    const buscaTexto = juego.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                       juego.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const buscaCat = juego.categorias.some(c => catsSeleccionadas.includes(c))
    const buscaPlat = juego.plataformas.some(p => platsSeleccionadas.includes(p))
    return buscaTexto && buscaCat && buscaPlat
  })

  return (
    <div className="app-container">
      <h1>Videojuegos V1 - Panel de Control</h1>
      
      {/* BUSCADOR */}
      <input 
        type="text" 
        placeholder="Buscar juego..." 
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{padding: '15px', fontSize: '18px'}}
      />

      {/* FILTROS */}
      <div className="filtros-panel">
        <h3>Categorías</h3>
        <div className="checkboxes-row">
          {listaCategorias.map(c => (
            <label key={c.id} className="checkbox-label">
              <input type="checkbox" checked={catsSeleccionadas.includes(c.nombre)} onChange={() => toggleCategoria(c.nombre)} />
              {c.nombre}
            </label>
          ))}
        </div>
        
        <h3 style={{marginTop: '15px'}}>Plataformas</h3>
        <div className="checkboxes-row">
          {listaPlataformas.map(p => (
            <label key={p.id} className="checkbox-label">
              <input type="checkbox" checked={platsSeleccionadas.includes(p.nombre)} onChange={() => togglePlataforma(p.nombre)} />
              {p.nombre}
            </label>
          ))}
        </div>
      </div>

      <button className="btn-add" onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? 'Cerrar Formulario' : '+ AÑADIR VIDEOJUEGO'}
      </button>

      {/* FORMULARIO AÑADIR */}
      {mostrarForm && (
        <form onSubmit={guardarJuego} style={{background: '#eef', padding: '20px', marginBottom: '20px', borderRadius: '8px'}}>
          <input placeholder="Nombre" required onChange={e => setNuevoJuego({...nuevoJuego, nombre: e.target.value})} />
          <textarea placeholder="Descripción" required onChange={e => setNuevoJuego({...nuevoJuego, descripcion: e.target.value})} />
          <input type="number" placeholder="Precio" required onChange={e => setNuevoJuego({...nuevoJuego, precio: Number(e.target.value)})} />
          <input placeholder="URL Imagen" onChange={e => setNuevoJuego({...nuevoJuego, imagen: e.target.value})} />
          <input type="date" required onChange={e => setNuevoJuego({...nuevoJuego, fechaLanzamiento: e.target.value})} />
          <input placeholder="Compañía" required onChange={e => setNuevoJuego({...nuevoJuego, compania: e.target.value})} />
          
          <label>Selecciona Categorías (Ctrl + Click):</label>
          <select multiple style={{height: '100px'}} onChange={e => handleMultiSelect(e, 'categorias')}>
            {listaCategorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>

          <label>Selecciona Plataformas (Ctrl + Click):</label>
          <select multiple style={{height: '100px'}} onChange={e => handleMultiSelect(e, 'plataformas')}>
            {listaPlataformas.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
          </select>
          
          <button className="btn-add" style={{marginTop: '10px', width: '100%'}}>GUARDAR JUEGO</button>
        </form>
      )}

      {/* LISTADO */}
      <div className="grid-juegos">
        {juegosFiltrados.map(juego => (
          <div key={juego.id} className="card" onClick={() => setJuegoDetalle(juego)}>
            <img src={juego.imagen || 'https://via.placeholder.com/300'} alt={juego.nombre}/>
            <div className="card-info">
              <h2>{juego.nombre}</h2>
              <p style={{color: 'green', fontWeight: 'bold', fontSize: '1.2em'}}>{juego.precio} €</p>
              <p><em>{juego.plataformas.join(", ")}</em></p>
              <p>{juego.descripcion.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {juegoDetalle && (
        <div className="modal-overlay" onClick={() => setJuegoDetalle(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setJuegoDetalle(null)}>X</button>
            <h2 style={{marginTop: 0}}>{juegoDetalle.nombre}</h2>
            <img src={juegoDetalle.imagen} style={{maxWidth: '100%', maxHeight: '300px', objectFit: 'contain'}} />
            <p><strong>Descripción:</strong> {juegoDetalle.descripcion}</p>
            <p><strong>Precio:</strong> {juegoDetalle.precio} €</p>
            <p><strong>Compañía:</strong> {juegoDetalle.compania}</p>
            <p><strong>Fecha:</strong> {juegoDetalle.fechaLanzamiento}</p>
            <p><strong>Categorías:</strong> {juegoDetalle.categorias.join(", ")}</p>
            <p><strong>Plataformas:</strong> {juegoDetalle.plataformas.join(", ")}</p>
            
            <button className="btn-delete" onClick={() => borrarJuego(juegoDetalle.id)}>ELIMINAR ESTE JUEGO</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App