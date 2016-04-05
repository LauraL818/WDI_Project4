var
  express = require('express'),
  movieRouter = express.Router(),
  movieCtrl = require('../controllers/movie.js')

movieRouter.post('/', movieCtrl.index)

module.exports = movieRouter
