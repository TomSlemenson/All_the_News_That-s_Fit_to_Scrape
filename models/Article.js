const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  summary1: {
    type: String,
    unique: true
  },

  summary2: {
    type: String,
    unique: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});


const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
