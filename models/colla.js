const mongoose = require('mongoose');

const collaSchema = new mongoose.Schema({
    
   
    id:{
        type : String
    }
     ,
    original_title: {
        type : String
    }
    ,
poster_path: {
        type : String
    }
     
   
});

const collaModel = mongoose.model('colla', collaSchema);
module.exports = collaModel;
