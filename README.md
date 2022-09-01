# Qatarbets Backend

AGREGAR UN ARCHIVO .env DENTRO DE LA CARPETA /api QUE CONSISTA DE LA SIGUIENTE FORMA:

```env
FRONT_HOST=hostDelFrontEnd
BACK_HOST=hostDelBackEnd
API_KEY=apiKeyDeAPISport
```
------------------------------------
Facu

Agregue la opcion de que se conecte al servidor del back con el .env o el puerto 3000 en /api/index.js 
porque no me dejaba abrir el localhost ya que me lo tiraba undefined

Cambie node por nodemon en el npm start del package.json de /api porque resetea el server cuando guarda un archivo 
(tambien me gusta que salgan colores cuando lo inicio)

Instale dependencias para realizar el login, asi que van a tener que hacer un npm i de ejs(es para el front) y bcryptjs

modificar el .env y agregar lo siguiente:
DB_USER = UsuarioDeSuDB
DB_PASSWORD = PassDeSuDB
DB_DATABASE= NombreDeSuDB

------------------------------------