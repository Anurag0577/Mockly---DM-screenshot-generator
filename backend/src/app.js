import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {connectDB} from './Database/index.js'
import authRoute from './Routes/authRoute.js'
import {errorHandler} from './Middlewares/errorHandler.js'
import previewRouter from './Routes/previewRoute.js'

// creating an instance of express
const app = express();
const PORT = 3000;
app.use(express.json({ limit: '50mb' }));
// app.use(express.json()) // this line is important bcoz it helps to parse the incoming request body as json objects
app.use(express.urlencoded({ extended: true })) // this line is important bcoz it helps to parse the incoming request body as urlencoded objects
app.use(cookieParser()); // Parse cookies from request headers

// enabling cors for cross origin resource sharing
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'Cookie'
    ],
    optionsSuccessStatus: 200
}))


// demo api later we will remove it
app.get('/', (req, res) => {
    res.json('This is the homepage.')
})

app.use('/api/auth', authRoute)
app.use('/api/preview', previewRouter)

app.use(errorHandler);

// once the db is connected then only the server start running
connectDB()
.then(() => {
    app.listen(PORT, () => {
    console.log(`Server start listning on ${PORT} `)
})
})


