const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

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

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have an id property instead of _id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog should have an id property')
    assert.strictEqual(typeof blog.id, 'string', 'id should be a string')
    assert.strictEqual(blog._id, undefined, '_id should not be present')
  })
})

after(async () => {
  await mongoose.connection.close()
})
