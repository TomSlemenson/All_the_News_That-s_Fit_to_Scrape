var db = require('../models/index.js');
var axios = require("axios");
var cheerio = require("cheerio");

// SCRAPE ALTPRESS ARTICLES
exports.altpress = function (req, res) {
  axios.get("https://www.altpress.com/news/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("div.item-details").each(function (i, element) {
      var result = {};
      result.title = $(element).children("h3").children().text();
      result.summary1 = $(element).children(".td-excerpt").text().split("\n")[1];
      result.summary2 = $(element).children(".td-excerpt").text().split("\n")[2];
      result.link = $(element).children("h3").children().attr("href");
      // console.log(result);

      db.Article.create(result)
        .then(function () {
          location.reload();
        }).catch(function (err) {
          res.json(err);
        })
    });
  });
}

// SCRAPE MTV ARTICLES
exports.mtv = function (req, res) {
  axios.get("http://www.mtv.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("a.secondary_item_wrap").each(function (i, element) {
      var result = {};
      result.title = $(element).children(".meta-wrap").children(".header").text();
      result.summary1 = $(element).children(".meta-wrap").children(".item_sticker").children("span").text();
      result.summary2 = $(element).children(".meta-wrap").children(".subHeader").text();
      result.link = $(element).attr("href");
      // console.log(result);

      db.Article.create(result)
        .then(function () {
          location.reload();
        }).catch(function (err) {
          res.json(err);
        })
    });
  })
}


// GET ARTICLES
exports.getArticles = function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
}


// DELETE A ARTICLE
exports.deleteArticles = function (req, res) {
  db.Article.deleteOne({ _id: req.params.id })
  .then(function () {
      return db.Note.remove({ article: req.params.id })
    }).then(function () {
      return location.reload();
    }).catch(function (err) {
      res.json(err);
    })
}

// GET ARTICLE'S TITLE AND ID
exports.titleAndIdArticles = function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
}

// GET COMMENT
exports.getComment = function (req, res) {
  db.Note.find({ article: req.params.id })
    .then(function (dbnotes) {
      res.json(dbnotes);
    })
    .catch(function (err) {
      res.json(err);
    });
}

// DELETE A COMMENT
exports.deleteComment = function (req, res) {
  db.Note.deleteOne({ _id: req.params.id })
    .then(function () {
      window.location = data.redirect;
    }).catch(function (err) {
      res.json(err);
    })
}


// UPDATE A COMMENT
exports.updateComment = function (req, res) {
  db.Note.update({ _id: req.params.id }, { $set: { title: req.body.title, body: req.body.body } })
    .then(function () {
    }).catch(function (err) {
      res.json(err);
    })
}

//ADD A COMMENT
exports.getAllComment = function (req, res) {
  db.Note.find({})
    .then(function (dbNote) {
      res.json(dbNote);
    })
    .catch(function (err) {
      res.json(err);
    });
}

//ADD A COMMENT
exports.addComment = function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
}








