var
  express = require('express'),
  userRouter = express.Router(),
  userCtrl = require('../controllers/user.js')

userRouter.route('/')
  .get(userCtrl.index)

userRouter.route('/:id')
  .get(userCtrl.user)
  .delete(userCtrl.delete)
  .patch(userCtrl.update)

userRouter.route('/addMovies')
  .post(userCtrl.add)

userRouter.route('/profile/movies')
  .get(userCtrl.show)

userRouter.route('/profile/movies/:id')
  .delete(userCtrl.remove)

module.exports = userRouter
