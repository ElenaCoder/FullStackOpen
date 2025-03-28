const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({}) // Clean the database before each test
})

test('fails with status 400 if username is missing', async () => {
  const newUser = {
    password: 'mypassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    .then(response => {
      assert.strictEqual(response.body.error, 'Username and password are required')
    })
})

test('fails with status 400 if password is missing', async () => {
  const newUser = {
    username: 'john123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    .then(response => {
      assert.strictEqual(response.body.error, 'Username and password are required')
    })
})

test('fails with status 400 if username is too short', async () => {
  const newUser = {
    username: 'jo',
    password: 'mypassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    .then(response => {
      assert.strictEqual(response.body.error, 'Username and password must be at least 3 characters long')
    })
})

test('fails with status 400 if password is too short', async () => {
  const newUser = {
    username: 'john123',
    password: '12'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    .then(response => {
      assert.strictEqual(response.body.error, 'Username and password must be at least 3 characters long')
    })
})

test('fails with status 400 if username is not unique', async () => {
  const newUser = {
    username: 'john123',
    password: 'mypassword'
  }

  // Create the first user
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  // Attempt to create the same user again
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    .then(response => {
      assert.strictEqual(response.body.error, 'Username must be unique')
    })
})

test('a valid user can be created', async () => {
  const newUser = {
    username: 'newuser',
    password: 'mypassword'
  }

  const usersAtStart = await User.find({})
  const initialCount = usersAtStart.length

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  const finalCount = usersAtEnd.length

  assert.strictEqual(finalCount, initialCount + 1, 'User count should increase by 1')

  const savedUser = usersAtEnd.find(user => user.username === newUser.username)
  assert.ok(savedUser, 'Saved user should exist in the database')
  assert.strictEqual(savedUser.username, newUser.username, 'Username should match')
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
