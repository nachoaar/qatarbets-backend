
require('dotenv').config();
const { Router } = require('express');
const {cloudinary} = require('../../utils')


const router = Router();

router.get('/cloud/pfp', async(req,res)=>{
   try{ 
    const {resources} = await cloudinary.search
    .expression('folder:qatar-bets-users-avatar')
    .sort_by('public_id','desc')
    .execute()
    const publicsId = await resources.map((file) =>file.url )
    res.send(publicsId)
    }catch(error){
        res.send(error)
    }
})

module.exports = router
