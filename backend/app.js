if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {connectDB} = require('./Utils/features')
const expressError = require('./Utils/expressError')

const app = express()
connectDB();

const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')   
const chatRoutes = require('./Routes/chatRoutes')

app.use(cors())
app.use(express.json());
app.use(cookieParser())

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message: err.message,
            status: err.statusCode
        }
    });
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})