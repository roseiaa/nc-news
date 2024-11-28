const {getUserData} = require("../models/users.models")


function getUsers(req, res, next) {
    getUserData().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = {getUsers}