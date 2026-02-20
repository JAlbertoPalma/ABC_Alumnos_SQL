import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { Alumno } from './models/Alumno.js';
import { Carrera } from './models/Carrera.js';

const app = express();
app.use(cors());
app.use(express.json());

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
            a.idCarrera = r.idCarrera; // <- Nombre unificado
            return a;
        });
        res.json(alumnos);
    } catch (err) {
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

//Borrar Alumno
app.delete('/api/alumnos/:id', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute('DELETE FROM alumnos WHERE id = ?', [req.params.id]);
        await conn.end();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Asignar carrera
app.put('/api/alumnos/asignar', async (req, res) => {
    try {
        const { alumnoId, idCarrera } = req.body; // <- Nombre unificado
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute('UPDATE alumnos SET idCarrera = ? WHERE id = ?', [idCarrera || null, alumnoId]);
        await conn.end();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Obtener Careras
app.get('/api/carreras', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT * FROM carreras');
        await conn.end();
        const carreras = rows.map(r => new Carrera(r.id, r.nombre));
        res.json(carreras);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Agregar carrera
app.post('/api/carreras', async (req, res) => {
    try {
        const { nombre } = req.body;
        const conn = await mysql.createConnection(dbConfig);
        const [result] = await conn.execute('INSERT INTO carreras (nombre) VALUES (?)', [nombre]);
        await conn.end();
        res.json({ id: result.insertId, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Borrar carreras
app.delete('/api/carreras/:id', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute('DELETE FROM carreras WHERE id = ?', [req.params.id]);
        await conn.end();
        res.json({ success: true });
    } catch (err) {
        console.error("Error borrando carrera:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));