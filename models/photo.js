var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var photoSchema = new Schema({
  auto_inc_id: Number,
  path: String,
  caption: String
});

module.exports = mongoose.model('Photos', photoSchema);
