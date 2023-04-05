const {roles} = require('../../services/roles.js')

const endPoint = {
    add:[roles.Admin],
    update:[roles.Admin],
}
module.exports = endPoint