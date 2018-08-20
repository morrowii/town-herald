
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const newsSchema = new Schema({
  id: ObjectId,
  title: String,
  synopsis: String,
  link: String
});

var news = mongoose.model('News', newsSchema);

module.exports = news;