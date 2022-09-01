const { Client } = require('pg');


const connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});


connection.connect((error) => {
    if(error){
        console.log(error);
        return
    }
    console.log('Conectado a DB');
})

module.exports = connection;