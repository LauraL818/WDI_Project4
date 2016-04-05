var User = require('../models/User.js')
var jwt = require('jsonwebtoken')
var express = require('express')
var app = express()
var config = require('../config.js')
// JWT
app.set('superSecret', config.secret)

module.exports = {
  index: function(req,res){
    User.find({}, function(err,users){
      if(err) throw err
      res.json(users)
    })
  },

  // create: function(req,res){
  //   User.create(req.body, function(err,user){
  //     if(err) throw err
  //     res.json(user)
  //   })
  // },

  //create user and assign token
  create: function(req,res){
  // create a new user
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    newUser.password = newUser.generateHash(newUser.password)

    // save that new user
    newUser.save(function(err){
      if(err) throw err
      console.log('User was saved')

      var token = jwt.sign(newUser, app.get('superSecret'), {
        expiresIn: 6000
      })

      res.json({success: true, message: 'Successfully registered and here is  a token', token:token})
    })
  },

  // authenticate user using jwt
  authenticate: function(req,res){
    User.findOne({email:req.body.email}, function(err,user){
      if(err) throw err
      if(!user){
        res.json({success:false, message:'User not found'})
      } else if (user) {
        //console.log(user.validPassword(req.body.password))
        if (!user.validPassword(req.body.password)){
          res.json({success:false, message:'Wrong password'})
        } else {
          var token = jwt.sign(user.toObject(), app.get('superSecret'), {
            expiresIn:6000
          })

          res.json({
            user: user,
            success:true,
            message: 'Here is your token',
            token: token
          })
        }
      }
    })
  },

  // show: function(req,res){
  //   User.findOne({_id:req.params.id}, function(err,user){
  //     if(err) throw err
  //     res.json(user)
  //   })
  // },

  delete: function(req,res){
    User.findOneAndRemove({_id:req.params.id}, function(err){
      if(err) throw err
      res.json({message:'user deleted'})
    })
  },
  update: function(req,res){
    User.findOneAndUpdate({_id:req.params.id}, req.body, {new:true}, function(err,user){
      if(err) throw err
      res.json(user)
    })
  }

}
