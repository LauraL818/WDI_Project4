var
  Movie = require('../models/Movie.js'),
  MovieDB = require('moviedb')(process.env.MOVIE_KEY)

module.exports = {
  index: function(req,res){
    MovieDB.miscNowPlayingMovies(function(err, response){
      res.json(response);
    })
  },
  show: function(req,res){
    MovieDB.movieInfo({id:req.params.id}, function(err, response){
      res.json(response)
    })
  },
  search: function(req,res){
    MovieDB.searchMovie({query: 'Zoolander' }, function(err, response){
    var movieId = response.results[0].id
    MovieDB.movieInfo({id: movieId}, function(err, response){
      console.log(response);
      res.json(response)
    })
  })
 }
}
