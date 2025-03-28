const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const morgan = require('./utils/morganConfig')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body',
  ),
)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app