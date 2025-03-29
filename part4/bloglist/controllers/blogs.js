const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const { title, author, url, likes, userId } = request.body

    if (!userId) {
      return response.status(400).json({ error: 'User ID is required' })
    }

    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response
        .status(400)
        .json({ error: `User with ID ${userId} not found` })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const { likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true },
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = blogsRouter
