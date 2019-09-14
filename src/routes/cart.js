const express = require('express')
const router = new express.Router()
const Cart = require('../models/cart')
const auth = require('../middleware/auth')

//CREATE AND ADD INGREDIENTS 
router.post('/cart/add', auth, async (req,res) => {
    const _id = req.user._id;
    try{ 
        const cart = await Cart.findOne({owner: _id});
        if(!cart){
            const car = new Cart({
                ingredients : req.body,
                owner : _id
            })
            await car.save();
            res.status(201).send('Created sucessfully');
        }
        else{
            console.log('run');
            // console.log(cart.ingredients);
            // console.log(req.body);
            cart.ingredients.push(...req.body);
            await cart.save();
            res.status(200).send({ingredients: cart.ingredients});
        }
    }catch(e){ 
        res.status(400).send(e);
    }
}) 

// READ CART
router.get('/cart/read', auth, async(req,res) => {
    const _id = req.user._id; 
    try{
        const cart = await Cart.findOne({owner: _id});
        if(!cart){
            res.status(204).send({ingredients: "nothing"})
        }
        else{
            res.status(200).send({ingredients: cart.ingredients});
        }
    }
    catch(e){
        res.status(400).send(e);
    }
})

// DELETE ONE ITEM OF CART
router.post('/cart/delete/one', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const cart = await Cart.findOne({owner: _id});
        if(!cart){
            res.status(404).send();
        }
        else{
            const index = req.body.index;
            cart.ingredients.splice(index,1);
            await cart.save();
            res.status(200).send({ingredients: cart.ingredients});
        }
    }catch(e){
        res.status(400).send(e);
    }
})

// CHANGE CART
router.post('/cart/change', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const cart = await Cart.findOne({owner: _id});
        const index = req.body.index;
        cart.ingredients[index].count = req.body.count;
        await cart.save();
        res.status(200).send('change successfully');
    }
    catch(e){
        res.status(400).send(e)
    }
})

// DELETE WHOLE CART
router.delete('/cart/delete', auth, async (req,res) => {
    const _id = req.user._id;
    try{
        const cart = await Cart.findOne({owner: _id});
        if(!cart){
            throw new Error("user not found");
        }
        else{
            cart.ingredients = [];
            await cart.save();
            res.status(200).send();
        }
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;