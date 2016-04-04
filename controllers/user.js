var User = require('../models/User.js')

module.exports = {
  index: function(req,res){
    User.find({}, function(err,users){
      if(err) throw err
      res.json(users)
    })
  },
  create: function(req,res){
    User.create(req.body, function(err,user){
      if(err) throw err
      res.json(user)
    })
  },
  show: function(req,res){
    User.findOne({_id:req.params.id}, function(err,user){
      if(err) throw err
      res.json(user)
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
  }


}
