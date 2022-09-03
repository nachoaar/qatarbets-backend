require("dotenv").config();
const server = require("./src/App.js");
const PORT = 3001;
const { conn } = require("./src/db.js");

conn.sync({ force: true }).then(() => {
  server.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor Activo!`);
  });
});

/* server.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor Activo!`);
});
 */