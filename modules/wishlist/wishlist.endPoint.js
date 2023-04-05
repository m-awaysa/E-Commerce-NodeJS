const {roles} = require('../../services/roles.js')

const endPoint = {
    add:[roles.User,roles.Admin],
    remove:[roles.User,roles.Admin],
}
module.exports = endPoint