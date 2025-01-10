const db = require("../db/connection")

function getUserData() {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}

function fetchUsername(username) {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows}) => {
        console.log(rows)
        return rows[0]
    })
}

module.exports = {getUserData, fetchUsername}