const express=require('express');
const fs=require('fs');
const router=express.Router();


router.post('/',(req,res)=>{
    console.log(req);
    res.send('Appointment updated')

})
module.exports=router;
