const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.blogList)
})

test('return all blog posts', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.blogList.length)
})

test('returned object\'s unique identifier is named \'id\'', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

afterAll(() => {
    mongoose.connection.close()
})