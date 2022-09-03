require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { match } = require("assert");
const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/qatarbets`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
//postgresql://${{ PGUSER }}:${{ PGPASSWORD }}@${{ PGHOST }}:${{ PGPORT }}/${{ PGDATABASE }}
//postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/qatarbets
const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { Group, Match, Player, Team, Bet, HisBets,User } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);


// relacion 1 a n de team con players
Team.hasMany(Player);
Player.belongsTo(Team);

// relacion 1 a n de group con teams
Group.hasMany(Team);
Team.belongsTo(Group);

// relacion 1 a n de group con matchs
Group.hasMany(Match);

Match.belongsTo(Group)


HisBets.hasMany(Bet)
HisBets.hasMany(User)

Match.hasMany(Bet)

User.hasMany(Bet)

// relacion de 1 a n de match con team
Match.belongsToMany(Team, {through: 'match_team'})
Team.belongsToMany(Match, {through: 'match_team'})

//relacion de 1 a n 
Match.hasMany(Bet)
Bet.belongsTo(Match)

// relacion de 1 a n
User.hasMany(Bet)
Bet.belongsTo(User)


// relacion de 1 a n
HisBets.hasMany(User)
User.belongsTo(HisBets)


// relacion de 1 a n
HisBets.hasMany(Bet)
Bet.belongsTo(HisBets)



HisBets.hasMany(Bet)
HisBets.hasMany(User)

Match.hasMany(Bet)

User.hasMany(Bet)

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
