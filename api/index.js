require("dotenv").config();
const server = require("./src/App.js");
const port = process.env.BACK_HOST;

conn.sync({ force: true }).then(() => {
  server.listen(port, () => {
    console.log(`Servidor exitosamente conectado a http://localhost:${port}`);
  });
});
