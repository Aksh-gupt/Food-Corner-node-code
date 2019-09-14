const express = require('express')
const router = new express.Router()
const Click = require('../models/click')

router.post('/click/add', async(req,res) => {
    try{
        const click = await Click.findOne({idrecipe: req.body.idrecipe});
        if(!click){
            const cli = new Click(req.body);
            await cli.save();
            res.status(200).send()
        }
        else{
            click.click++;
            click.rating = req.body.rating;
            await click.save();
            res.status(200).send()
        }
    }
    catch(e){
        res.status(400).send()
    }
})

router.get('/click/read', async(req,res) => {
    try{
        var mysort = {click: -1};
        let arr = [];
        Click.find({}, function (err, result) {
            if (err) {
                throw new Error(err);
            } else {
                arr.push(result[0]);
                arr.push(result[1]);
                arr.push(result[2]);
                arr.push(result[3]);
                arr.push(result[4]);
                arr.push(result[5]);
                arr.push(result[6]);
                arr.push(result[7]);
                res.status(200).send({array: arr});
            }
        }).sort(mysort);
    }
    catch(e){
        res.status(400).send()
    }
})

module.exports = router;