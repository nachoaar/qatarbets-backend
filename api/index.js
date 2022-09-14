require("dotenv").config();
const server = require("./src/App.js");
const PORT = 3001;
const { conn } = require("./src/db.js");
const cors = require('cors');

conn.sync({ force: false }).then(() => {
<<<<<<< HEAD
=======
  server.use(cors({ credentials: true }));
>>>>>>> 4c357f9953804a8f5d10b9a35fc8af36847097ee
  server.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor Activo!`);
  });
});

/* server.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor Activo!`);
});
 */
