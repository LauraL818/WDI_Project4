var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema

var movieSchema = new Schema({
  title: String,
  release: String,
  poster: String,
  overview: String,
  revenue: Number,
  budget: Number,
  rating: Number,
  runtime: Number,
  company: String,
  genre: String,
  country: String,
  users:[{type: Schema.Types.ObjectId, ref: "User"}]
})

var Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
