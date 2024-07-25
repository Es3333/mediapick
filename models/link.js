const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  
movieId: {
    type:Number,
 
 } ,
 
imdbId:{
    type:Number,
    
  } ,
  
tmdbId: {
    type:Number,
   
 } ,
 
});

const linkModel= mongoose.model('link', linkSchema);
module.exports=linkModel