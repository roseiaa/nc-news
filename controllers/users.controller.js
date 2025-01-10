const {getUserData, fetchUsername} = require("../models/users.models")


function getUsers(req, res, next) {
    getUserData().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        console.log(err)
    })
}

function getUsername(req, res, next) {
    const {username} = req.params
    fetchUsername(username).then((username) => {
        console.log(username)
        res.status(200).send({username})
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = {getUsers, getUsername}