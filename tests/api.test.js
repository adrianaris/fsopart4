const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.blogList)
})

describe('blog http get request tests', () => {
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

describe('blogs http post request tests', () => {
    test('one blog post', async () => {
        const blog = {
            title: 'title',
            author: 'author',
            url: 'url',
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
    
    test('missing like property', async () => {
        const noLikes = {
            title: 'no likes',
            author: 'Serbanescu',
            url: 'adrianserbanescu.com'
        }
        
        await api.post('/api/blogs').send(noLikes)
        
        const result = await Blog.findOne(noLikes)
        expect(result.likes).toBe(0)
    })
    
    test('missing title and url post', async () => {
        const missingTitle = {
            author: 'author',
            url: 'url'
        }
        
        const missingURL = {
            title: 'title',
            author: 'author'
        }
        
        const missingTitleAndURL = {
            author: 'author'
        }
        
        await api
            .post('/api/blogs')
            .send(missingTitle)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(missingURL)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(missingTitleAndURL)
            .expect(400)
    })
})

test('blogs http delete request', async () => {
    const blogList = await helper.allBlogsInDb()
    const randomBlog = blogList[Math.floor(Math.random())] 

    await api
        .delete(`/api/blogs/${randomBlog.id}`)
        .expect(204)
    
    const result = await api.get('/api/blogs')
    expect(result.body.map(n => n.id)).not.toContain(randomBlog.id)
})

test('blogs http put request', async () => {
    const blogList = await helper.allBlogsInDb()
    const randomBlog = blogList[Math.floor(Math.random())]
    
    const blog = {
        title: "modified",
        author: 'modified',
        url: 'modified'
    }

    await api
        .put(`/api/blogs/${randomBlog.id}`)
        .send(blog)
        .expect(200)

    const test = await Blog.findOne(blog)
    expect(test).not.toBe(null)
})

describe('invalid users are not created', () => {
    test('missing username', async () => {
        const user = {
            name: 'Adrian',
            password: 'pass'
        }
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
        
        const test = await User.findOne(user)
        expect(test).toBe(null)
    })
    
    test('missing password', async () => {
        const user = {
            username: 'user',
            name: 'Adrian'
        }
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect({ error: "password missing" })

        const test = await User.findOne(user)
        expect(test).toBe(null)
    })
    
    test('password too short', async () => {
        const user = {
            username: 'user',
            name: 'Adrian',
            password: '12'
        }
        
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect({ error: "password is too short"})
        
        const test = await User.findOne(user)
        expect(test).toBe(null)
    })
})

afterAll(() => {
    mongoose.connection.close()
})