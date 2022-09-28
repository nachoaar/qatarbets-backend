require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE, } = process.env;
const { DB_USER, DB_PASSWORD, DB_HOST } = require('./DB_variables.js');

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
      database: PGDATABASE,
      dialect: "postgres",
      host: PGHOST,
      port: PGPORT,
      username: PGUSER,
      password: PGPASSWORD,
      pool: {
        max: 3,
        min: 1,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: true,
    })
    : new Sequelize(
      `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/qatarbets`,
      { logging: false, native: false }
    );

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Group, Match, Player, Team, Bet, HisBets, User, Stage_fixture } = sequelize.models;

Team.hasMany(Player);
Player.belongsTo(Team);
Group.hasMany(Team);
Team.belongsTo(Group);
Group.hasMany(Match);
Match.belongsTo(Group)
HisBets.hasMany(Bet)
HisBets.hasMany(User)
Match.hasMany(Bet)
User.hasMany(Bet)
Match.belongsToMany(Team, {through: 'match_team'})
Team.belongsToMany(Match, {through: 'match_team'})
Match.hasMany(Bet)
Bet.belongsTo(Match)
User.hasMany(Bet)
Bet.belongsTo(User)
HisBets.hasMany(User)
User.belongsTo(HisBets)
HisBets.hasMany(Bet)
Bet.belongsTo(HisBets)
HisBets.hasMany(Bet)
HisBets.hasMany(User)
Match.hasMany(Bet)

module.exports = {
  ...sequelize.models,
  conn: sequelize, 
};
