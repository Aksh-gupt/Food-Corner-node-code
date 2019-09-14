 const mongoose = require('mongoose');

 const ratingSchema = new mongoose.Schema({
     idrecipe: {
         type: String,
         required: true,
         trim: true
     },
     rating: {
         type: Number,
         required: true
     },
     people: {
         type: Number,
         default: 1,
         required: true
     }
 })

 const Rating = mongoose.model('Rating', ratingSchema);
 module.exports = Rating;