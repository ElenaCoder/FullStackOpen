const { test, after, beforeEach, describe  } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token = ''

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'http://example.com/first',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Jane Doe',
    url: 'http://example.com/second',
    likes: 10,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({}) // Clear users to avoid conflicts

  // Create a test user
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  // Log in the user to get a token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' })

  token = loginResponse.body.token // Store the received token

  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  await Promise.all(blogObjects.map(blog => blog.save()))
})


test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have an id property instead of _id', async () => {
  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog should have an id property')
    assert.strictEqual(typeof blog.id, 'string', 'id should be a string')
    assert.strictEqual(blog._id, undefined, '_id should not be present')
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Elena Golovanova',
    url: 'https://example.com/test-blog',
    likes: 5
  }

  // Get initial blogs count
  const blogsAtStart = await Blog.find({})
  const initialCount = blogsAtStart.length

  // Send POST request
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Add token to the request
    .send(newBlog)
    .expect(201) // Ensure successful creation
    .expect('Content-Type', /application\/json/)

  // Fetch blogs after the request
  const blogsAtEnd = await Blog.find({})
  const finalCount = blogsAtEnd.length

  // Ensure blog count increased by 1
  assert.strictEqual(finalCount, initialCount + 1, 'Blog count should increase by 1')

  // Verify that the new blog is in the database
  const savedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  assert.ok(savedBlog, 'Saved blog should exist in database')
  assert.strictEqual(savedBlog.author, newBlog.author, 'Author should match')
  assert.strictEqual(savedBlog.url, newBlog.url, 'URL should match')
  assert.strictEqual(savedBlog.likes, newBlog.likes, 'Likes should match')
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Test Author',
    url: 'https://example.com/no-likes'
    // 'likes' property is intentionally missing
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)  // Ensure blog is created successfully
    .expect('Content-Type', /application\/json/)

  // Verify that likes defaults to 0
  assert.strictEqual(response.body.likes, 0, 'Likes should default to 0 when missing')
})

test('fails with status 400 if title is missing', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'https://example.com/missing-title',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('fails with status 400 if url is missing', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Test Author',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

describe('deletion of a blog post', () => {
  test('successfully deletes a blog post', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(blog => blog.id)
    assert(!ids.includes(blogToDelete.id))
  })

  test('returns 404 for deleting a non-existing blog', async () => {
    const nonExistingId = '605c72b75e48f3659f83a3a1'

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})

test('updates the number of likes for an existing blog', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { likes: blogToUpdate.likes + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1, 'Likes should be incremented')
  assert.strictEqual(response.body.title, blogToUpdate.title, 'Title should remain unchanged')
})

test('adding a blog fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Hacker',
    url: 'https://example.com/hack',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401) // Expect 401 Unauthorized
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length, 'Blog count should not change')
})

after(async () => {
  await mongoose.connection.close()
})
