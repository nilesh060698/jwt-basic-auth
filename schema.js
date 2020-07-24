const mongoose = require('mongoose');

const  studentSchema = new mongoose.Schema( {
    name : {type : String, required: true, max: 100},
    roll : {type : String,required : true},
    age : { type : Number,required : true, max : 100},
    role: { type: String , default: "guitarist"},
    address: { type : String,required : true,max: 100}
});

const subjectSchema = new mongoose.Schema ( {
    subject:[{type : String}],
    roll : { type : String, required: true}   
})


exports.module = mongoose.model('students',studentSchema);
exports.module = mongoose.model('subjects',subjectSchema);