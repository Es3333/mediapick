const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
    
   
    
imdbId:{
        type : Number
    }
     ,
    Title: {
        type : String
    }
    ,
    Poster: {
        type : String
    },
     
   score :{
        type : Number
     }
   
});

const posterModel = mongoose.model('poster', posterSchema);
module.exports =  posterModel;
