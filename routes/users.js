var
  express = require('express'),
  userRouter = express.Router(),
  userCtrl = require('../controllers/user.js')

userRouter.route('/')
  .get(userCtrl.index)

userRouter.route('/:id')
  // .get(userCtrl.show)
  .delete(userCtrl.delete)
  .patch(userCtrl.update)

module.exports = userRouter
