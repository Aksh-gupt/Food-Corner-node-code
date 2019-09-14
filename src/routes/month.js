const express = require('express')
const router = new express.Router()
const Month = require('../models/month')
const auth = require('../middleware/auth')

router.post('/month/save', auth, async (req,res) => {
    try{
        const month = req.body.month;
        const year = req.body.year;
        const check = await Month.findOne({month: month , year: year});
        if(!check){
            const mon = new Month(req.body);
            await mon.save();
            res.status(201).send("Successful")
        }
        check.amount += req.body.amount;
        await check.save;
        res.status(200).send("update successfully");

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/month/read', async(req,res) => {
    try{
        let year = await Month.find({year: 2019})
        let arr = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(var i=0;i<year.length;i++){
            var t =  year[i].month;
            t--;
            arr[t] += year[i].amount;
        }
        res.status(200).send(arr);
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;