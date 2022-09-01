require('dotenv').config()
const server = require('./src/App.js');
const port = process.env.BACK_HOST || 3000;

server.listen(port, () => {
  console.log(`Servidor exitosamente conectado a http://localhost:${port}`);
});