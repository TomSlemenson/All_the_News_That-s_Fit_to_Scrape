
const express = require("express");
const router = express.Router();
const application_controller = require('../controllers/application_controller.js');


// RENDER INDEX
router.get('/', application_controller.index);
// SCRAPE ALTPRESS ARTICLES
router.get("/scrapealtpress", application_controller.altpress);
// SCRAPE MTV ARTICLES
router.get("/scrapemtv", application_controller.mtv);
// GET ARTICLES
router.get("/articles", application_controller.getArticles);
// DELETE A ARTICLE
router.delete("/articles/:id", application_controller.deleteArticles);
// GET ARTICLE'S TITLE AND ID
router.get("/articles/:id", application_controller.titleAndIdArticles);
// GET COMMENT
router.get("/notes/:id", application_controller.getComment);
// DELETE A COMMENT
router.delete("/notes/:id", application_controller.deleteComment);
// UPDATE A COMMENT
router.put("/notes/:id", application_controller.updateComment);
//ADD A COMMENT
router.post("/articles/:id", application_controller.addComment);

module.exports = router;