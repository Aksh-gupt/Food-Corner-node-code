const express = require('express')
const router = new express.Router();
const Rating = require('../models/rating');

// ADD RATING
router.post('/rating/submit', async (req,res) => {
    try{
        const id = req.body.idrecipe;
        const rating = await Rating.findOne({idrecipe: id});
        if(!rating){
            const newrating = new Rating(req.body);
            await newrating.save();
            res.status(200).send(newrating);
        }
        else{
            let persons = rating.people;
            const rtngnow = rating.rating;
            let rat = (rtngnow*persons + req.body.rating)/(persons+1);
            rating.rating = rat;
            rating.people = persons+1;
            await rating.save();
            res.status(200).send('update successfully');
        }
    }catch(e){
        res.status(400).send(e);
    }
})

router.post('/rating/read', async(req,res)=>{
    try{
        const id = req.body.idrecipe;
        const rating = await Rating.findOne({idrecipe: id});
        if(!rating){
            res.status(204).send();
        }
        else{
            res.status(200).send({res: rating});
        }
    }
    catch(e){
        res.status(400).send(e);
    }
} )

module.exports = router;