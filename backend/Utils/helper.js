const {userSocketMap} = require('../app')

module.exports.getSokcets = (users = []) => {
    return users.map((user) => userSocketMap.get(user._id.toString()))
}