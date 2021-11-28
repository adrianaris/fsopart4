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
    await User.deleteMany({})
    await api.post('/api/users')
        .send(helper.user)
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
        const user = await User.findOne(helper.user)
        const blog = {
            title: 'title',
            author: 'author',
            url: 'url',
            userId: user._id,
            likes: 10
        }
        
        const res = await api.post('/api/login').send(helper.user)
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${res.body.token}`)
            .send(blog)
        
        const result = await api.get('/api/blogs')
        expect(result.body).toHaveLength(helper.blogList.length + 1)
        const blogTitle = result.body.map(blog => blog.title)
        expect(blogTitle).toContain(blog.title)
    })
    
    test('missing like property', async () => {
        const user = await User.findOne(helper.user)
        const noLikes = {
            title: 'no likes',
            author: 'Serbanescu',
            userId: user._id,
            url: 'adrianserbanescu.com'
        }
        
        const res = await api.post('/api/login').send(helper.user)
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${res.body.token}`)
            .send(noLikes)
        
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
    
    test('missing token', async () => {
        const user = await User.findOne(helper.user)
        const blog = {
            title: 'title',
            author: 'author',
            url: 'url',
            userId: user._id
        }
        
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(401)
            .expect({ error: 'invalid token' })
        
        const test = await Blog.findOne(blog)
        expect(test).toBe(null)
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
            name: 'name',
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
            name: 'name'
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
            name: 'name',
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

test('adding user', async () => {
    const user = {
        username: 'addinguser',
        name: 'name',
        password: 'password'
    }
    
    await api
        .post('/api/users')
        .send(user)
        .expect(200)
    const test = await User.findOne(user)
    expect(test).not.toBe(null)
})

afterAll(() => {
    mongoose.connection.close()
})