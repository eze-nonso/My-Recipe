import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import Umzug from 'umzug';
import settings from '../babel_hook';


const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = settings[env];
const db = {};

console.log(`Loaded config using env "${env}"`);

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config.options || {})
  : new
  Sequelize(
    `${config.dialect}://${config.username}:${config.password}@${config.host}/${config.database}`,
    config.options || {}
  );


fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// handling migration
const umzug = new Umzug({
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ],
    path: path.resolve(__dirname, '../migrations'),
    pattern: /\.js$/
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize,
    tableName: 'sequelize_meta',
  }
});

db.umzug = umzug;

export default db;
