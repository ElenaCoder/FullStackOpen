require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 3001
const MONGODB_URI =
  NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV,
  SECRET
}