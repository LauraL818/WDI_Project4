var User = require('../models/User.js')

module.exports = {
  index: function(req,res){
    User.find({}, function(err,users){
      if(err) throw err
      res.json(users)
    })
  }
}
