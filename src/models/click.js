 const mongoose = require('mongoose')

 const clickSchema = new mongoose.Schema({
     idrecipe: {
         type: String,
         required: true
     },
     title: {
         type: String,
         required: true,
     },
     image_url: {
         type: String,
         required: true
     },
     rating: {
         type: Number,
         required: true
     },
     publisher: {
         type: String,
         required: true
     },
     click: {
         type: Number,
         default: 1,
         required: true
     }
 })


 const Click = mongoose.model('Click', clickSchema);

// var mysort = {click: -1};

// Click.find({}, function (err, result) {

//     if (err) {

//         console.log("error query");

//     } else {

//         console.log(result);

//     }

// }).sort(mysort);

module.exports = Click;
