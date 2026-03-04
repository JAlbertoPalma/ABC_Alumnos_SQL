import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Carrera } from "./Carrera.js";

export const Alumno = sequelize.define('Alumno', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { 
    tableName: 'alumnos',
    timestamps: false 
});

Alumno.belongsTo(Carrera, { 
    foreignKey: 'idCarrera', 
    onDelete: 'SET NULL' 
});