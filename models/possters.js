const mongoose = require('mongoose');

const possterSchema = new mongoose.Schema({
    
   
    

   
title: {
        type : String
    }
   
    , 
   poster_path:{
        type : String
     }
   ,
vote_average:{
     type : Number
  } 
  ,
backdrop_path:{
   type : String
}
,

});

const possterModel = mongoose.model('posster', possterSchema);
module.exports =  possterModel;
