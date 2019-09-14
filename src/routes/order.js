const express = require('express')
const router = new express.Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')
const { sendOrderConfirm } = require('../email/confirm');

// CREATE ORDER
router.post('/order/add', auth, async(req,res) => {
    const _id = req.user._id; 
    try{
        const order = await Order.findOne({owner: _id});
        if(!order){
            const ord = new Order({
                ingredients : req.body,
                owner: _id 
            })
            await ord.save();
            sendOrderConfirm(req.user.email,req.user.firstname)
            res.status(201).send(ord);
        }
        else{
            order.ingredients = order.ingredients.concat(req.body);
            await order.save();
            sendOrderConfirm(req.user.email,req.user.firstname)
            res.status(200).send(order);
        }
    }
    catch(e){
        res.status(400).send(e)
    }
})

// READ ORDER
router.get('/order/read', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const order = await Order.findOne({owner: _id});
        if(!order){
            res.status(204).send()
        }
        else{
            res.status(200).send({order: order.ingredients, _id: req.user._id, firstname: req.user.firstname});
        }
    }
    catch(e){
        res.status(400).send(e)
    }
})

// DELETE ORDER
router.post('/order/delete', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const order = await Order.findOne({owner: _id});
        if(!order){
            res.status(404).send("user not found");
        } 
        else{
            const index = req.body.index;
            if(order.ingredients[index].completed === true){
                throw new Error("Delivered order can't be deleted");
            }
            // order.ingredients.splice(index,1);
            order.ingredients[index].deleted = true;
            await order.save();
            // console.log(order.ingredients[index].deleted);
            res.status(200).send();
        }
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = router;