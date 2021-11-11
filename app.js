const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const Blog = require('./models/blog')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/bloglist')
const middleware = require('./utils/middleware')
const morgan = require('morgan')

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('buid'))
app.use(express.json())

app.use('/api/blogs', blogRouter)

morgan.token('POST', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length - :response-time ms :POST'))
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app