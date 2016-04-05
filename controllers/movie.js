var
  Movie = require('../models/Movie.js'),
  MovieDB = require('moviedb')(process.env.MOVIE_KEY)

module.exports = {
  index: function(req,res){
    MovieDB.movieInfo({id: 217}, function(err, response){
      res.json(response);
    });
  },
}
