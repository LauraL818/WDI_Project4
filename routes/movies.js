var
  express = require('express'),
  movieRouter = express.Router(),
  movieCtrl = require('../controllers/movie.js')

movieRouter.post('/', movieCtrl.index)
movieRouter.post('/:id', movieCtrl.show)
movieRouter.post('/search/movie', movieCtrl.search)

module.exports = movieRouter
