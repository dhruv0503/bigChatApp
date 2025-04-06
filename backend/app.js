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
const { NEW_MESSAGE, START_TYPING, STOP_TYPING, ONLINE_USERS } = require('./Constants/events')
const cloudinary = require('cloudinary').v2
const { corsOptions, cloudinaryConfig } = require('./Constants/config')
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: corsOptions })

app.set("io", io)

connectDB();

cloudinary.config(cloudinaryConfig)

const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const requestRoutes = require('./Routes/requestRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const { onNewMessage, onTyping, onStopTyping } = require('./Controllers/socketMethods')
const { socketAuthenticator } = require('./Middlewares/auth')
const { setSocket, deleteSocket, getAllSockets, getOnlineUserIds, getSocket} = require('./Utils/helper')

app.use(cors(corsOptions))
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

io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
    )
})

io.on("connection", (socket) => {
    const user = socket.user;
    const userId = user._id.toString();
    const isAlreadyOnline = getSocket(userId);
    setSocket(userId, socket.id);
    socket.emit(ONLINE_USERS, { onlineUsers: getOnlineUserIds() })
    if (!isAlreadyOnline) {
        io.emit(ONLINE_USERS, { onlineUsers:  getOnlineUserIds()});
    }
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        await onNewMessage(io, chatId, members, message, user);
    })
    socket.on(START_TYPING, ({ members, chatId }) => {
        onTyping(io, members, chatId, user._id)
    })
    socket.on(STOP_TYPING, ({ members, chatId }) => {
        onStopTyping(io, members, chatId, user._id)
    })
    socket.on("disconnect", () => {
        deleteSocket(user._id);
        if (!getSocket(userId)) {
            io.emit(ONLINE_USERS, { onlineUsers: getOnlineUserIds() });
        }
    })
})

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use(globalError)

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})