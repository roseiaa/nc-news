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


module.exports = {getArticleCommentData, insertCommentData}