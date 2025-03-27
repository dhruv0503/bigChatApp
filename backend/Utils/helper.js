const userSocketMap = new Map()

const getSocket = (userId) => userSocketMap.get(userId.toString())
const setSocket = (userId, socketId) => userSocketMap.set(userId.toString(), socketId)

const deleteSocket = (userId) => userSocketMap.delete(userId.toString())
const getAllSockets = () => Array.from(userSocketMap.entries())
const getSockets = (users = []) => users.map((user) => userSocketMap.get(user.toString())).filter(user => user !== undefined);

const myFriendsCache = new Map();

const getCachedFriends = (userId) => myFriendsCache.get(userId.toString())
const setCachedFriends = (userId, friends) => myFriendsCache.set(userId.toString(), friends)
const updateFriendsCache = (userId, friendId, option = "ADD") => {
    const friends = getCachedFriends(userId);
    if (friends) {
        if (option === "ADD") setCachedFriends([...friends, friendId])
        else setCachedFriends(friends.filter((friend) => friend.toString() !== friendId.toString()))
    }
    else setCachedFriends([friendId])
}

module.exports = { getSocket, setSocket, deleteSocket, getAllSockets, getSockets, getCachedFriends, setCachedFriends, updateFriendsCache }

