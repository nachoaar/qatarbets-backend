# Qatarbets Backend
- rutas get
  -
  - todos los equipos: https://qatarbets-backend-production-ab54.up.railway.app/teams/get
  - todos los partidos: https://qatarbets-backend-production-ab54.up.railway.app/fixture/get
  - partido por id: https://qatarbets-backend-production-ab54.up.railway.app/fixture/855734
  - todos los grupos: https://qatarbets-backend-production-ab54.up.railway.app/groups
  - trae una apuesta por id: https://qatarbets-backend-production-ab54.up.railway.app/bet/betId/:id
  - trae un equipo por id: https://qatarbets-backend-production-ab54.up.railway.app/teams/squad/26

- rutas post
  - 
  - cargar una apuesta: https://qatarbets-backend-production-ab54.up.railway.app/bet/newBet
    - ejemplo: 
      -  
          {
           "fecha_hora":"2016-01-01 00:00:00+00:00",
            "money_bet":5000,
            "result":"draw",
            "condition":"ready",
            "expected_profit":6000,
            "final_profit":0,
            "matchId":855734
           }
