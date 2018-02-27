const Model = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

class User {
  static signup(req,res){
    Model.findOne({email : req.body.email},(err,rows)=>{
      if(rows){
        res.send('email ini sudah terdaftar')
      } else{
        console.log(req.body)
        bcrypt.genSalt(10,function(err,salt){
          bcrypt.hash(req.body.password,salt,function(err,hash){
            let obj ={
              email : req.body.email,
              password : hash
            }
            Model.create(obj,(err,rows)=>{
              if(err){
                res.status(500).json({message :err})
              }else {
                res.status(200).json({message : 'terdaftar',data : rows})
              }
            })
          })
        })
      }
    })
  }

  static signin(req,res){
    Model.findOne({email : req.body.email},(err,user)=>{
      if(err){
        res.status(500).json({message : err})
      } else{
        console.log('fvjosinvsdo',req.body)
        bcrypt.compare(req.body.password,user.password,(err,data)=>{
          if(!err){
            let payload={
              _id : user._id,
              email : user.email
            }
            jwt.sign(payload,process.env.SECRETKEY,(err,token)=>{
              if(err){
                res.status(500).json({message : err})
              } else {
                res.status(200).json({message : 'masuk',token : token})
              }
            })
          }
        })
      }
    })
  }
}

module.exports = User