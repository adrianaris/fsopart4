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

describe('tests for initially saved blogs', () => {
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
})

describe('writing to the db tests', () => {
    test('http post request one blog post', async () => {
        const blog = {
            title: 'title',
            author: 'author',
            likes: 10
        }
        
        await api
            .post('/api/blogs')
            .send(blog)
        
        const result = await api.get('/api/blogs')
        expect(result.body).toHaveLength(helper.blogList.length + 1)
        const blogTitle = result.body.map(blog => blog.title)
        expect(blogTitle).toContain(blog.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})