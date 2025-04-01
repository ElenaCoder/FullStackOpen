const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../utils/config')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

// Middleware to extract token from Authorization header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

// userExtractor middleware to extract the user from the token
const userExtractor = async (request, response, next) => {
  const token = request.token

  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    // Find the user from the decoded token ID
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(400).json({ error: 'user not found' })
    }

    // Attach the user to the request object
    request.user = user
    next()
  } catch (error) {
    console.error('Error in userExtractor:', error)
    response.status(401).json({ error: 'token invalid or expired' })
  }
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}