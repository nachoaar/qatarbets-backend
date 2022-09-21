require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
//const { FRONT_HOST, DEPLOY_URL } = process.env;
const URL = "http://localhost:300" || process.env.DEPLOY_URL;
const server = express();
const { ALLOW_ALL} = require('./DB_variables.js');

server.use(express.urlencoded({ extended: false}));
server.use(express.json() );
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  //res.header('Access-Control-Allow-Origin', `https://qatarbets-frontend-git-develop-nachoaar.vercel.app`); 
  const allowedOrigins = [ process.env.DEPLOY_URL, 'https://qatarbets-frontend-git-develop-nachoaar.vercel.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (ALLOW_ALL === 1) {
    res.setHeader('Access-Control-Allow-Origin', "*");
  }else if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', "*");
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// evaluar el siguiente codigo
/* app.use((req, res, next) => {
  const allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
}); */

// variable de session
const session = require('express-session');
server.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


server.use('/', routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
