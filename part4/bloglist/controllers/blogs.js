const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const { title, author, url, likes } = request.body
    const user = request.user // Access the user from the request object

    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id,
    })

    const savedBlog = await blog.save()

    // Add the saved blog to the user's list of blogs
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const user = request.user // Access the user from the request object

    // Find the blog by ID
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    // Check if the user is the owner of the blog
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'Not authorized to delete this blog' })
    }

    //  Delete the blog from the Blog collection
    await Blog.findByIdAndDelete(id)

    // Remove the blog reference from the user's blogs array
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== id)
    await user.save()

    response.status(204).end()
  } catch (error) {
    console.error('Error deleting blog:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
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
