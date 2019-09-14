const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const bcrypt = require('bcryptjs')
const { sendWelcomeEmail } = require('../email/confirm')

//CREATE USER
router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try{
        await user.save(); 
        const token = await user.generateAuthToken();
        sendWelcomeEmail(req.body.email,req.body.firstname);
        res.status(201).send({token: token});
    }catch(e){ 
        res.status(400).send(e);
    }
}) 

//LOGIN USER
router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({token: token});
    }
    catch(e){
        res.status(400).send(e)
    }
})

// LOGOUT USER
router.post('/users/logout' , auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save(); 
        res.status(200).send("logout successfully")
    }
    catch(e){
        res.status(400).send(e)
    }
})

// READ PROFILE
router.get('/users/me', auth,async (req,res) => {
    try{
        res.status(200).send(req.user);
    }
    catch(e){
        res.status(400).send(e)
    }
}) 

//UPDATE PROFILE
router.patch('/users/update',auth,async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstname','lastname','email','password','gender','mobile_number']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send()
        console.log("not valid");
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        console.log("hi");
        await req.user.save()
        res.status(201).send(req.user)
    }catch(e){
        res.status(400).send()
    }
}) 

//UPDATE PASSWORD
router.patch('/users/update/password',auth, async(req,res) => {
    try{
        const isValid = await bcrypt.compare(req.body.password,req.user.password);
        if(!isValid){
            throw new Error("password is incorrect");
        }
        req.user.password = req.body.newpassword;
        await req.user.save();
        res.status(200).send('sucessfully');
    }catch(e){
        res.status(400).send(e);
    }
})

const upload = multer({
    limits: {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            cb(new Error('please upload a png or jpg or jpeg type file'));
        }
        console.log('limits works')
        cb(undefined,true);
    }
})

//UPLOAD AN AVATAR
router.post('/users/profile/avatar', auth, upload.single('avatar'), async (req,res) => {
    console.log('start');
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    console.log('end');
    await req.user.save();
    res.status(200).send();
},(error, req,res, next) => {
    res.status(400).send({error: error.message})
})

// GET AVATAR
router.get('/users/read/avatar', auth,async (req,res)=> {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id})

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type' , 'image/png')
        res.send({image: user.avatar})
    }catch(e){
        res.status(404).send()
    }
    
})
 
// DELETE AVATAR
router.delete('/users/profile/avatar', auth, async (req,res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

// ADD ADDRESS
router.post('/users/address', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        user.addresses.push(req.body);
        await user.save();
        res.status(200).send({address: user.addresses}); 
    }
    catch(e){
        res.status(400).send(e)
    }
})

// UPDATE ADDRESS
router.post('/users/address/update', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        const index = req.body.index;
        user.addresses[index] = req.body;
        await user.save();
        res.status(200).send({address: user.addresses});
    }
    catch(e){
        res.status(400).send(e);
    }
})

// READ ADDRESS
router.get('/users/address/read', auth,async (req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        res.status(200).send({address: user.addresses})
    }
    catch(e){
        res.status(400).send(e);
    }
})

// DELETE A ADDRESS
router.post('/users/address/delete', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        const index = req.body.index;
        user.addresses.splice(index, 1);
        await user.save();
        res.status(200).send({address: user.addresses});
    }
    catch(e){
        res.status(400).send();
    }
})

// UPDATE GENDER
router.post('/users/gender', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id : _id});
        user.gender = req.body.gender;
        await user.save();
        res.status(200).send()
    }
    catch(e){
        res.status(400).send()
    }
})

// ADD RATING ID
router.post('/user/rating', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        user.rating_ids.push(req.body);
        await user.save();
        res.status(200).send('submit rating successfully');
    }
    catch(e){
        res.status(400).send(e);
    }
})

// SAVE RATING 
router.post('/user/rating/read', auth, async (req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        let num = -1;
        for(var i = 0;i<user.rating_ids.length;i++){
            if(user.rating_ids[i].idrecipe === req.body.id){
                num = i;
                break;
                // res.status(200).send({rat: user.rating_ids[i].rating});
            }
        }
        if(num !== -1){
            res.status(200).send({rat: user.rating_ids[num]});
        }
        else{
            res.status(204).send();
        }
    }
    catch(e){
        res.status(400).send(e);
    }
})

// SAVE LIKED RECIPE
router.post('/user/like/add', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        for(var i=0;i<req.body.length;i++){
            let flag = 0;
            for(var j=0;j<user.likes.length;j++){
                
                if(user.likes[j].idrecipe === req.body[i].idrecipe){
                    flag = 1;
                    console.log('hi');
                    break;
                }
            }
            if(flag === 0){
                user.likes.push(req.body[i]);
            }
        }
        await user.save();
        res.status(200).send({like: user.likes});
    }
    catch(e){
        res.status(400).send(e);
    }
})

// REMOVE SAVE LIKE
router.post('/user/like/remove', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        
        const index = user.likes.findIndex((ind) => {
            return ind.idrecipe === req.body.idrecipe
        });
        console.log(index);
        
        user.likes.splice(index, 1);
        await user.save();
        res.status(200).send({like: user.likes});
    }
    catch(e){
        res.status(400).send(e);
    }
})

// READ LIKES
router.get('/user/like/read', auth, async(req,res) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id: _id});
        res.status(200).send({like: user.likes});
    }
    catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;