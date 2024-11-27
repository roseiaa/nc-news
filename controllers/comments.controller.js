const endpoints = require("../endpoints.json")
const {getArticleCommentData, insertCommentData} = require("../models/comments.models")

function getArticleComments(req, res, next) {
    const {article_id} = req.params
    getArticleCommentData(article_id).then((comments) => {
        res.status(200).send({comments})
    })
}

function postComment(req,res, next) {
    const body = req.body
    const {article_id} = req.params
    insertCommentData(article_id, body).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })

}

module.exports = {postComment, getArticleComments}