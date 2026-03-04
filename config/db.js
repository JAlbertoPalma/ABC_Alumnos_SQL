import { Sequelize } from "sequelize";

const sequelize = new Sequelize('gestion_escolar', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

export default sequelize;