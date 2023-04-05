const {roles} = require('../../services/roles.js')

const endPoint = {
    add:[roles.Admin,roles.User],
    delete:[roles.Admin,roles.User],
}
module.exports = endPoint