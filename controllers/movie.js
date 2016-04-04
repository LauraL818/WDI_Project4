var Movie = require('../models/Movie.js')

module.exports = {
  index: function(req,res){
    Movie.find({}, function(err,movies){
      if(err) throw err
      res.json(movies)
    })
  }
}
