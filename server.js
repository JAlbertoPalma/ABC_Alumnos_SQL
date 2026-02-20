import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { Alumno } from './models/Alumno.js';
import { Carrera } from './models/Carrera.js';

const app = express();
app.use(cors());
app.use(express.json());

// config de la bd
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root', 
    database: 'gestion_escolar'
};

//Obtener alumnos
app.get('/api/alumnos', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT * FROM alumnos');
        await conn.end();

        const alumnos = rows.map(r => {
            const a = new Alumno(r.id, r.nombre, r.edad);
            a.carreraId = r.carreraId;
            return a;
        });
        res.json(alumnos);
    } catch (err) {
        console.error("Error en MySQL:", err.message);
        res.status(500).json({ error: err.message });
    }
});

//Obtener Carreras
app.get('/api/carreras', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT * FROM carreras');
        await conn.end();
        const carreras = rows.map(r => new Carrera(r.id, r.nombre));
        res.json(carreras);
    } catch (err) {
        console.error("Error en MySQL:", err.message);
        res.status(500).json({ error: err.message });
    }
});


//Agregar alumno
app.post('/api/alumnos', async (req, res) => {
    try {
        const { nombre, edad } = req.body;
        const conn = await mysql.createConnection(dbConfig);
        const [result] = await conn.execute('INSERT INTO alumnos (nombre, edad) VALUES (?, ?)', [nombre, edad]);
        await conn.end();
        res.json({ id: result.insertId, nombre, edad });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Asignar carrera
app.put('/api/alumnos/asignar', async (req, res) => {
    try {
        const { alumnoId, carreraId } = req.body;
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute('UPDATE alumnos SET carreraId = ? WHERE id = ?', [carreraId || null, alumnoId]);
        await conn.end();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


