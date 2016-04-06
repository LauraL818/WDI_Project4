var User = require('../models/User.js')
var jwt = require('jsonwebtoken')
var express = require('express')
var app = express()
var Movie = require('../models/Movie.js')
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

      var token = jwt.sign(newUser.toObject(), app.get('superSecret'), {
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
  },

// Find user and add movie to that user
  add: function(req, res){
    User.findOne({_id: req.decoded._id}, function(err, user){
      if(err) throw err
      Movie.create(req.body, function(err, movie){
        if(err) return console.log(err)
        console.log(movie)
        movie.users.push(user)
        movie.save(function(err, movie){
          user.movies.push(movie)
          user.save(function(err, newUser){
            console.log(newUser)
            if(err) throw err
            // console.log(newUser)
            res.json(newUser)
          })
        })
      })



      // var movie = new Movie(req.body)
      //
      //   movie.save(function(err, movie){
      //
      //     if(err) throw err
      //     movie.users.push(user)
      //     movie.save(function(err,movie){
      //         user.movies.push(movie)
      //
      //         user.save(function(err, newUser){
      //           console.log(newUser)
      //           if(err) throw err
      //           // console.log(newUser)
      //           res.json(newUser)
      //       })
      //     })
      // })
    })
  },
  show: function(req,res){
    // console.log(req)
    User.findOne({_id: req.decoded._id})
      .populate("movies")
      .exec(function(err,user){
        res.json(user)
      })
  }

}
