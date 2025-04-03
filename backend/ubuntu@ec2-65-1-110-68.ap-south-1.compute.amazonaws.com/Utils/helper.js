const userSocketMap = new Map()

const getSocket = (userId) => userSocketMap.get(userId.toString())
const setSocket = (userId, socketId) => userSocketMap.set(userId.toString(), socketId)

const deleteSocket = (userId) => userSocketMap.delete(userId.toString())
const getAllSockets = () => Array.from(userSocketMap.entries())
const getSockets = (users = []) => users.map((user) => userSocketMap.get(user.toString())).filter(user => user !== undefined);
const getOnlineUserIds = () => Array.from(userSocketMap.keys())

module.exports = { getSocket, setSocket, deleteSocket, getAllSockets, getSockets,  getOnlineUserIds }

