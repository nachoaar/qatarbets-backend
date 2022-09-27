
![Logo](https://media.discordapp.net/attachments/1024420821558636644/1024426610004340736/header.png)


# Qatarbets Backend

Servidor utilizado para manejar la información de la app Qatarbets.

Gran parte de la información usada proviene de [API-SPORT](https://api-sports.io/)

Para hacer correr el proyecto debe pararse sobre la carpeta /api y ejecutar los siguientes comandos en la terminal:

- Para iniciar el servidor de forma normal:
```bash
  npm start
```

- Para iniciar el proyecto con Nodemon:
```bash
  npm run dev
```

## Ejemplos de usos de la API

#### Obtener todos los partidos del fixture

```
  GET /fixture/get
```
Ejemplo:
```json
{},
{
    "id": 855752,
    "date": "2022-11-26T19:00:00.000Z",
    "status": "Finished",
    "home_team_id": 26,
    "home_team": {
        "id": 26,
        "name": "Argentina",
        "logo": "https://media.api-sports.io/football/teams/26.png",
        "coach": "L. Scaloni",
        "group_points": 6,
        "code": "ARG",
        "founded": 1893,
        "groupId": 3
    },
    "away_team_id": 16,
    "away_team": {},
    "result_match": "away",
    "stadium_name": "Lusail Iconic Stadium",
    "profit_coef_home": 1.2,
    "profit_coef_draw": 1.3,
    "profit_coef_away": 1.5,
    "city": "Lusail",
    "groupId": 3

},
{},
```

#### Obtener un partido en especifico

```
  GET /fixture/${id}
```

| Parameter | Type     | Description |
| :-------- | :------- | :------------|
| `id`      | `number` | **Requerido**.|

Ejemplo:
```json
[
    {
        "id": 855752,
        "date": "2022-11-26T19:00:00.000Z",
        "status": "Finished",
        "home_team_id": 26,
        "home_team": {},
        "away_team_id": 16,
        "away_team": {},
        "result_match": "away",
        "stadium_name": "Lusail Iconic Stadium",
        "profit_coef_home": 1.2,
        "profit_coef_draw": 1.3,
        "profit_coef_away": 1.5,
        "city": "Lusail",
        "groupId": 3
    }
]
```
#### Obtener todos los grupos

```
  GET /groups
```
Ejemplo:

```json
{},
{

    "id": 3,
    "name": "grupo_C",
    "teams": [
        {
            "name": "Saudi Arabia",
            "logo": "https://media.api-sports.io/football/teams/23.png"
        },
        {
            "name": "Mexico",
            "logo": "https://media.api-sports.io/football/teams/16.png"
        },
        {
            "name": "Poland",
            "logo": "https://media.api-sports.io/football/teams/24.png"
        },
        {
            "name": "Argentina",
            "logo": "https://media.api-sports.io/football/teams/26.png"
        }
    ]

},
{},
```

#### Logearse con email y contraseña

```
  POST /user/login
```

Ejemplo:

request por body: 
```json
{
    "email": "email@example.com",
    "pass": "password_example"
}
```

respuesta: 
```json
{
    "message": "Usuario logueado con exito!",
    "avatar": "avatar_de_usuario",
    "name": "nombre_de_usuario",
    "rol": "rol_de_usuario",
}
```
### Tecnologias usadas
- NodeJS
- Express
- Sequelize
- PostgreSQL
- Nodemailer
- Stripe

