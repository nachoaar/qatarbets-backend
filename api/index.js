require("dotenv").config();
const server = require("./src/App.js");
const PORT = 3001;
const { conn } = require("./src/db.js");
const cors = require('cors');

conn.sync({ force: false }).then(() => {
  server.use(cors({ credentials: true }));
  server.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor Activo!`);
  });
});

