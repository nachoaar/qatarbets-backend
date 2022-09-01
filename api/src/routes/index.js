const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
    res.json('que onda pa')
})

router.post('/CreateUser', async (req, res) => {
    
})


module.exports = router;