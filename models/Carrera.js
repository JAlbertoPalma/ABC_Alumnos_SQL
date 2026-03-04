import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Carrera = sequelize.define('Carrera', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { 
    tableName: 'carreras',
    timestamps: false 
});