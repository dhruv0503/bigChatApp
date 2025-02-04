if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./Utils/features')
const expressError = require('./Utils/expressError')
const { globalError } = require('./Middlewares/error')
const { Server } = require('socket.io')
const http = require('http')
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('./Constants/events')
const uuid = require('uuid')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
connectDB();

const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const requestRoutes = require('./Routes/requestRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const { getSokcets } = require('./Utils/helper')
const Message = require('./Models/messageModel')


app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const userSocketMap = new Map()

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    const sender = {
        _id: "67924f64e1ed6e7ea3e134f3",
        username: "llakshita"
    }
    userSocketMap.set(sender._id.toString(), socket.id);
    socket.on(NEW_MESSAGE, async({ chatId, members, message }) => {

        const messageForRealTime = {
            content: message,
            _id: uuid.v4(),
            sender: {
                _id: sender._id,
                username: sender.username
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        }
        const messageForDb = new Message({
            content: message,
            sender: sender._id,
            chat: chatId
        })

        const membersSocket = getSokcets(members)

        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime
        })
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId })

        await messageForDb.save();
    })

    socket.on("disconnect", () => {
        userSocketMap.delete(sender._id.toString());
        console.log("User Disconnected", socket.id)
    })
})

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use(globalError)


server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})

module.exports = {userSocketMap}