
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/studentDB',{useNewUrlParser:true, useUnifiedTopology: true },(err)=>{
  if(!err)
  {
    console.log("mongo db connected");
  }
  else{
    console.log("error in DB connection"+err);
  }
});
require('./schema.js');


