const {getUserData, fetchUsername} = require("../models/users.models")


function getUsers(req, res, next) {
    getUserData().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

function getUsername(req, res, next) {
    const {username} = req.params
    fetchUsername(username).then((username) => {
        res.status(200).send({username})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getUsers, getUsername}