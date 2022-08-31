require("dotenv").config();
const server = require("./src/App.js");
const port = process.env.BACK_HOST;
const { conn } = require("./src/db.js");

conn.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log(`Servidor exitosamente conectado a http://localhost:${port}`);
  });
});
