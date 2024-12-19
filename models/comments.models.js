const db = require("../db/connection")
const format = require('pg-format');

function getArticleCommentData(id) {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id])
    .then(({rows}) => {
        return rows
    })
}

function insertCommentData(id, bodyData) {
    if(!bodyData || Object.keys(bodyData).length === 0) {
        return  Promise.reject({status: 400, message: "Invalid Request"})
    }

    if(typeof bodyData.username !== "string" || typeof bodyData.body !== "string") {
        return  Promise.reject({status: 400, message: "invalid data types inputted in body"})
    }

    const comment = [{
        author: bodyData.username,
        body: bodyData.body,
        article_id: id,

    }]

    commentValues = comment.map(({author, body, article_id}) => {
        return [author, body, article_id, created_at = new Date(), votes = 0]
    })
    const insertCommentQuery = format(`INSERT INTO comments (author, body, article_id, created_at, votes) VALUES %L;`, commentValues);
    return db.query(insertCommentQuery).then(() => {
        return db.query(`SELECT * FROM comments ORDER BY comment_id DESC LIMIT 1`).then((data) => {
            return data.rows
        })
    })
}

function removeCommentData(id) {
    return db.query("SELECT * FROM comments").then((comments) => {
        if(Number.isNaN(Number(id))) {
            return Promise.reject({status: 400, message: "Invalid Id"})
        }
        let result = comments.rows.filter(obj => obj.comment_id === Number(id))
        if (result.length === 0) {
            return Promise.reject({status: 404, message: "Comment does not exist."})

        }

        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id])
    })

}

function updateComment(voteModifier, id) {
    if(!voteModifier || typeof voteModifier !== "number") {
        return Promise.reject({status: 400, message: "Invalid Request"})
    }
    const values = [voteModifier, id]
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2`, values)
    .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = ${id}`)
        .then((data) => {
            if(data.rows.length === 0) {
                return Promise.reject({status: 404, message: "Invalid input"})
            }
            return data.rows
        })
    })
}

module.exports = {getArticleCommentData, insertCommentData, removeCommentData, updateComment}