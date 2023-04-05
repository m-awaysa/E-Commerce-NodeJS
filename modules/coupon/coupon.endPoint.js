const {roles} = require('../../services/roles.js')

const endPoint = {
    add:[roles.Admin],
    update:[roles.Admin],
    delete:[roles.Admin]
}
module.exports = endPoint