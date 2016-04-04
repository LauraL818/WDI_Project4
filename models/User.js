var
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema

var userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  movies:[{type: Schema.Types.ObjectId, ref: "Movie"}]
})

//Generate hash passwords
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

//Authenticate
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

var User = mongoose.model('User', userSchema)

module.exports = User
