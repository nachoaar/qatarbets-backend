require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const { FRONT_HOST } = process.env;

const server = express();

server.use(express.urlencoded({ extended: false}));
server.use(express.json() );
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://localhost:${FRONT_HOST}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


// Esto para poder usar codigo js en el front
server.set('view engine', 'ejs');

// invoco a bcryptjs
const bcryptjs = require('bcryptjs');

// variable de session
const session = require('express-session');
server.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//invoca al modulo de conexion a la db
const connection = require('../database/db');

server.use('/', routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
