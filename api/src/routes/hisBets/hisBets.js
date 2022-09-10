const {Router} = require('express')
const {HisBets,Bet} = require('../../db')

const router = Router()


const getHisBets = async function(){
    let history = await HisBets.findAll()
    return history
}
const getHistoryById = async function(id){
    let userHistory = await HisBets.findAll({where:{
        id_user: id,
        model: Bet
    }})

    return userHistory
}


router.get('/', async( req,res, next) =>{
    const {id} = req.params
    try{
        if(id){
            let h = await getHistoryById(id)
        }else{
            let h  = await getHisBets()
        }
        res.status(200).send(h)

    }catch(error){

    }
})



module.exports = router