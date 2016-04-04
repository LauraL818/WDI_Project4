var
  express = require('express'),
  movieRouter = express.Router(),
  movieCtrl = require('../controllers/movie.js')

movieRouter.get('/movies', movieCtrl.index)

module.exports = movieRouter
