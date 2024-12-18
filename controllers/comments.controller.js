const endpoints = require("../endpoints.json")
const {getArticleCommentData, insertCommentData, removeCommentData, updateComment} = require("../models/comments.models")

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

function deleteComment(req, res, next) {
const {comment_id} = req.params
removeCommentData(comment_id).then(() => {
    res.status(204).send()
})
.catch((err) => {
    next(err)
})
    
}


function patchComment(req, res, next) {
    const newVote = req.body.inc_votes
    const {comment_id} = req.params
    updateComment(newVote, comment_id).then((comment) => {
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}
module.exports = {postComment, getArticleComments, deleteComment, patchComment}