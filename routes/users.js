var
  express = require('express'),
  userRouter = express.Router(),
  userCtrl = require('../controllers/user.js')

userRouter.route('/')
  .get(userCtrl.index)

userRouter.route('/:id')
  .delete(userCtrl.delete)
  .patch(userCtrl.update)

userRouter.route('/addMovies')
  .post(userCtrl.add)
  
userRouter.route('/profile/movies')
  .get(userCtrl.show)

module.exports = userRouter
