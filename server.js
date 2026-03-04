import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import { Alumno } from './models/Alumno.js';
import { Carrera } from './models/Carrera.js';

const app = express();
app.use(cors());
app.use(express.json());

//Sincronizamos los modelos con la bbdd
sequelize.sync({ alter: true})
.then(() => console.log('Base de datos sincronizada'))
.catch(err => console.error('Error al sincronizar', err));

//Obtener alumnos
app.get('/api/alumnos', async (req, res) => {
    try{
        const alumnos = await Alumno.findAll();
        res.json(alumnos);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

//Agregar alumno
app.post('/api/alumnos', async (req, res) => {
    try {
        const nuevoAlumno = await Alumno.create(req.body);
        res.json(nuevoAlumno);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Borrar Alumno
app.delete('/api/alumnos/:id', async (req, res) => {
    try {
        await Alumno.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Asignar carrera (PUT)
app.put('/api/alumnos/asignar', async (req, res) => {
    try {
        const { alumnoId, idCarrera } = req.body;
        await Alumno.update({ idCarrera }, { where: { id: alumnoId } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Obtener carreras
app.get('/api/carreras', async (req, res) => {
    try {
        const carreras = await Carrera.findAll();
        res.json(carreras);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

//Crear carreras
app.post('/api/carreras', async (req, res) => {
    try {
        const nueva = await Carrera.create(req.body);
        res.json(nueva);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

//Borrar carreras
app.delete('/api/carreras/:id', async (req, res) => {
    try {
        await Carrera.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

//Puerto a escuchar para el cliente
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


