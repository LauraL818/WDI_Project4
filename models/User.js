var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema

var userSchema = new Schema({
  name: String,
  email: String,
  password: String
  // movies:[{type: Schema.Types.ObjectId, ref: "Movie"}]
})

var User = mongoose.model('User', userSchema)

module.exports = User
