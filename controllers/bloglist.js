const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }

    return null
}

blogRouter.get('/', async (request, response) =>{
    const bloglist = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(bloglist)
})

blogRouter.post('/', async (request, response) => {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing  or invalid' })
    }
    const user = await User.findById(request.body.userId)

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        user: user._id,
        likes: request.body.likes === undefined ? 0 : request.body.likes
    })

    const savedBlog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const blog = {
       title: request.body.title,
       author: request.body.author,
       url: request.body.url,
       likes: request.body.likes 
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
    
    response.json(updatedBlog)
})

module.exports = blogRouter