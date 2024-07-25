const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true
 } ,
  password:{
     type:String,
     required: true
  } ,
  
userId: {
    type:Number,
   
 } ,
 
});

const userModel= mongoose.model('user', userSchema);
module.exports=userModel