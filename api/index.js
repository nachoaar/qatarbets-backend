require("dotenv").config();
const server = require("./src/App.js");
const PORT = 3001;
const { conn } = require("./src/db.js");
const cors = require('cors');

conn.sync({ force: false }).then(() => {
  server.use(cors({ origin: '*' }));
  server.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor Activo!`);
  });
});

/* server.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor Activo!`);
});
 */
