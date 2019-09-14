 const mongoose = require('mongoose')
 const validator = require('validator')
 const bcrypt = require('bcryptjs')
 const jwt = require('jsonwebtoken')

 const userSchema = new mongoose.Schema({
     firstname: {
         type: String,
         required: true,
         trim: true
     },
     lastname:{
        type: String,
        required: true,
        trim: true
     },
     email: {
         type: String,
         trim: true,
         unique: true,
         required: true,
         lowercase: true,
         validate(value){ 
             if(!validator.isEmail(value)){
                 throw Error('Email is invalid');
             }
         }
     },
     password: {
         type: String,
         trim: true,
         required: true,
         minlength: 7
     },
     addresses: [{
        name: {
            type: String,
            trim: true,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            trim: true,
            required: true
        }
     }],
     gender: {
         type: String
     },
     mobile_number: {
         type: Number
     },
     rating_ids: [{
        idrecipe:{ 
             type: String,
             trim: true,
             required: true,
             default: 0
         },
         rating:{
             type:Number,
             required: true,
             default: 0
         }
     }],
     likes: [{
         idrecipe: {
             type: String,
             required: true
         },
         image_url: {
             type: String,
             required: true
         },
         title:{
             type: String,
             required: true
         }
     }],
     tokens: [{
         token : {
             type: String,
             required: true
         }
     }],
     avatar: {
         type: Buffer
     }
 })

 userSchema.virtual('carts', {        // Can give any name here but by reference carts
     ref: 'Cart',
     localField: '_id',
     foreignField: 'owner'
 })

 userSchema.virtual('orders', {
     ref: 'Order',
     localField: '_id',
     foreignField: 'owner'
 })

 userSchema.methods.toJSON = function(){
     const user = this
     const userObject = user.toObject();
     
     delete userObject.password;
     delete userObject.avatar;
     delete userObject.tokens;

     return userObject;
 }

//  userSchema.methods.generateAuthToken = async () => {
//      const user = this;
//      const token = jwt.sign({ _id : user._id.toString()}, "akshatgupta2000aannu");
//      user.tokens = user.tokens.concat({token})
//      user.save();
//      return token
//  }
 userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()} , "akshatgupta2000aannu")
    user.tokens = user.tokens.concat({ token })
    user.save()
    return token
}

 userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Unable to login")
    }
    const isValid = await bcrypt.compare(password,user.password)
    if(!isValid){
        throw new Error("Unable to login")
    }
    return user
}

 userSchema.pre('save', async function(next){
     const user = this
     if(user.isModified('password')){
         user.password = await bcrypt.hash(user.password, 8);
     }
     next()
 })

 const User = mongoose.model('User', userSchema);

 module.exports = User;