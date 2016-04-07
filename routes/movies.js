var
  express = require('express'),
  movieRouter = express.Router(),
  movieCtrl = require('../controllers/movie.js')

movieRouter.post('/:id', movieCtrl.show )
movieRouter.post('/', movieCtrl.index)
movieRouter.post('/search/movie', movieCtrl.search)
movieRouter.post('/:id/similar', movieCtrl.similar)

module.exports = movieRouter
