const endpoints = require("../endpoints.json")
const {getArticleData, getArticleIdData, updateArticle} = require("../models/articles.models")

function getArticleId(req, res, next) {
    const {article_id} = req.params
    getArticleIdData(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })

}

function getArticles(req, res, next) {
    const {sort_by = "created_at", order = "DESC"} = req.query
    console.log(sort_by)
    getArticleData(sort_by, order).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

function patchArticle(req, res, next) {
    const newVote = req.body.inc_votes
    const {article_id} = req.params
    updateArticle(newVote, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getArticles, getArticleId, patchArticle}
