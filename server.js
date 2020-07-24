require('./db.js');
const mongoose = require('mongoose');
var userData = mongoose.model('students');
var subjectData = mongoose.model('subjects');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
var cors = require('cors');
const jwt = require('jsonwebtoken')

app.listen(3001,(err) => {
    if(!err) {
    console.log("serve ris running on port 3000");
    } else { console.log(err)}
   });
// app.use(cors({
//     'allowedHeaders': ['Content-Type'],
//     'origin': '*',
//     'preflightContinue': true
// }));

app.post('/saveStudent',(req,res) => {
    var usersData =  new userData(req.body);
    var subjectsData = new subjectData();
    usersData.save((err,doc) => {
        if(!err) {
            userData.aggregate([
                {
                  $lookup:
                    {
                      from: "subjects",
                      localField: "roll",
                      foreignField: "roll",
                      as: "subjects"
                    }
               }
             ],(err,doc) => {
                 console.log(doc);
                 res.json({doc});
             })
            
        }
    })
});

app.post('/saveSubject',(req,res) => {
    console.log(typeof req.body.subject);
    var subjectsData =  new subjectData(req.body);
    subjectsData.save((err,doc) => {
        if(!err) {
            res.json ({msg : "subjects saved successfully"}) 
        }
    })
})
app.post('/updateStudent',(req,res) => {
    userData.update({roll : req.body.roll},{$set:{name : "updated Name"}},(err,doc) => {
        if(!err) {
            res.json ({ doc});
        }
    
    });

});
app.post('/studentLogin',(req,res) => {
    userData.find({$and:[{name:req.body.name},{roll: req.body.roll}]},(err,doc) => {
        if(!err) {
            console.log(doc);
            if(doc.length) {
            jwt.sign({doc},'secretkey', (err,token) => {
                res.json({
                message:'success',
                doc,
                token,
                access:true
                });
              });
            } else {
                res.json({msg:"NO match found"});
            }
        }
    })
});


app.get('/restrictedRoute',verifyToken,(req,res) => {
    jwt.verify(req.token,'secretkey',(err,authdata)=> {
        if(err) {
            res.sendStatus(403);
        }
        else {
            res.json({
                authdata,
                access:true
  
            });
            
        }
    })
  });

function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken  = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        console.log(1);
        res.sendStatus(403);
    }
}
