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


//Obtener Carreras


//Agregar alumno


//Asignar carrera


app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
