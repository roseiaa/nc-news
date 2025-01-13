const db = require("../db/connection");
const format = require("pg-format");

function fetchArticleIdData(id) {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Invalid input" });
      } else {
        return rows;
      }
    });
}

//
function fetchArticleData(sort_by, order, limit, p, topic) {
  const queryValues = [];
  const validSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort_by" });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      message: `unable to order by ${order}`,
    });
  }

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id `;
  sqlQuery += `ORDER BY ${sort_by} ${order} `;
  
  const pageLimit = limit
  const page = p
  const offset = (page-1) * pageLimit
  if (limit && topic) {
    sqlQuery+= `LIMIT $2 OFFSET $3`
    queryValues.push(pageLimit, offset)
  }
  else if (limit && !topic) {
    sqlQuery+= `LIMIT $1 OFFSET $2`
    queryValues.push(pageLimit, offset)
  }

  console.log(queryValues)
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        message: "No articles matching topic",
      });
    }
    rows.forEach((article) => {
      article.comment_count = Number(article.comment_count);
    });
    return rows;
  });
}

function updateArticle(voteModifier, id) {
  if (!voteModifier || typeof voteModifier !== "number") {
    return Promise.reject({ status: 400, message: "Invalid Request" });
  }
  const values = [voteModifier, id];
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2`,
      values
    )
    .then(() => {
      return db
        .query(`SELECT * FROM articles WHERE article_id = ${id}`)
        .then((data) => {
          if (data.rows.length === 0) {
            return Promise.reject({ status: 404, message: "Invalid input" });
          }
          return data.rows;
        });
    });
}

function insertArticle(bodyData) {
    if(!bodyData || Object.keys(bodyData).length === 0) {
        return  Promise.reject({status: 400, message: "Invalid Request"})
    }
    
    for (let data of Object.keys(bodyData)) {
        if (typeof bodyData[data] !== "string") {
            return Promise.reject({ status: 400, message: "invalid data types inputted in body" });
        }
    }

  const articleData = [
    {
      author: bodyData.username,
      title: bodyData.title,
      body: bodyData.body,
      topic: bodyData.topic,
      article_img_url: bodyData.article_img_url,
    },
  ];

  if (articleData[0].article_img_url === undefined) {
    articleData[0].article_img_url = "default image";
  }

  articleValues = articleData.map(
    ({ author, title, body, topic, article_img_url }) => {
      return [
        author,
        body,
        title,
        topic,
        article_img_url,
        (created_at = new Date()),
        (votes = 0),
      ];
    }
  );

  const insertArticleQuery = format(
    `INSERT INTO articles (author, body, title, topic, article_img_url, created_at, votes) VALUES %L RETURNING *`,
    articleValues
  );
  return db.query(insertArticleQuery).then((insertResult) => {
    const insertedArticle = insertResult.rows[0];
    const article_id = insertedArticle.article_id;

    const commentCountQuery =
      "SELECT COUNT(c.comment_id) AS comment_count FROM comments c WHERE c.article_id = $1";

    return db
      .query(commentCountQuery, [article_id])
      .then((commentCountResult) => {
        const commentCount = Number(commentCountResult.rows[0].comment_count);
        return { ...insertedArticle, comment_count: commentCount };
      });
  });
}

module.exports = {
  fetchArticleData,
  fetchArticleIdData,
  updateArticle,
  insertArticle,
};
