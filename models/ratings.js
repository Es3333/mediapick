const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  

    userId: {
    type:Number,
 
 } ,
 

 movieId:{
    type:Number,
    
  } ,
  
  rating: {
    type:Number,
   
 } ,
 
});

const ratingModel= mongoose.model('rating', ratingSchema);
module.exports=ratingModel