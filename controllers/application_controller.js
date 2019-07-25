const db = require('../models/index.js');
const axios = require("axios");
const cheerio = require("cheerio");

const controllerObj = {
  // RENDER INDEX
  index: (req, res) => {
    res.render('index');
  },

  // SCRAPE ALTPRESS ARTICLES
  altpress: (req, res) => {
    axios.get("https://www.altpress.com/news/").then(response => {
      const $ = cheerio.load(response.data);
      $("div.item-details").each((i, element) => {
        const result = {};
        result.title = $(element).children("h3").children().text();
        result.summary1 = $(element).children(".td-excerpt").text().split("\n")[1];
        result.summary2 = $(element).children(".td-excerpt").text().split("\n")[2];
        result.link = $(element).children("h3").children().attr("href");
        // console.log(result);

        db.Article.create(result)
          .then(() => location.reload())
          .catch(err => res.json(err))
      });
    });
  },

  // SCRAPE MTV ARTICLES
  mtv: (req, res) => {
    axios.get("http://www.mtv.com/").then(response => {
      const $ = cheerio.load(response.data);
      $("a.secondary_item_wrap").each(function (i, element) {
        const result = {};
        result.title = $(element).children(".meta-wrap").children(".header").text();
        result.summary1 = $(element).children(".meta-wrap").children(".item_sticker").children("span").text();
        result.summary2 = $(element).children(".meta-wrap").children(".subHeader").text();
        result.link = $(element).attr("href");
        // console.log(result);

        db.Article.create(result)
          .then(() => location.reload())
          .catch(err => res.json(err))
      });
    })
  },


  // GET ARTICLES
  getArticles: (req, res) => {
    db.Article.find({})
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  },


  // DELETE A ARTICLE
  deleteArticles: (req, res) => {
    db.Article.deleteOne({ _id: req.params.id })
      .then(() => db.Note.remove({ article: req.params.id }))
      .then(() => location.reload())
      .catch(err => res.json(err))
  },

  // GET ARTICLE'S TITLE AND ID
  titleAndIdArticles: (req, res) => {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err))
  },

  // GET COMMENT
  getComment: (req, res) => {
    db.Note.find({ article: req.params.id })
      .then(dbnotes => res.json(dbnotes))
      .catch(err => res.json(err));
  },

  // DELETE A COMMENT
  deleteComment: (req, res) => {
    db.Note.deleteOne({ _id: req.params.id })
      .then(() => window.location = data.redirect)
      .catch(err => res.json(err))
  },


  // UPDATE A COMMENT
  updateComment: (req, res) => {
    db.Note.update({ _id: req.params.id }, { $set: { title: req.body.title, body: req.body.body } })
      .then(() => alert("Your Comment was updated!"))
      .catch(err => res.json(err))
  },

  //ADD A COMMENT
  getAllComment: (req, res) => {
    db.Note.find({})
      .then(dbNote => res.json(dbNote))
      .catch(err => res.json(err));
  },

  //ADD A COMMENT
  addComment: (req, res) => {
    db.Note.create(req.body)
      .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }))
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  }

}

module.exports = controllerObj;





