const {roles} = require('../../services/roles.js')

const endPoint = {
    profile :[roles.Admin, roles.User]
}

module.exports= {endPoint}