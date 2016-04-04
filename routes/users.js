var
  express = require('express'),
  userRouter = express.Router(),
  userCtrl = require('../controllers/user.js')

userRouter.route('/users')
  .get(userCtrl.index)
  .post(userCtrl.create)

userRouter.route('/users/:id')
  .get(userCtrl.show)
  .delete(userCtrl.delete)
  .patch(userCtrl.update)


module.exports = userRouter
