const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response) =>{
    const bloglist = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(bloglist)
})

blogRouter.post('/', async (request, response) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log(decodedToken)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing  or invalid' })
    }
    const user = await User.findById(decodedToken.id)

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
    const token = request.token
    const user = request.user
    if (!token || !user.id) {
       return response.status(401).json({ error: 'token missing  or invalid' })
    } 
    
    const blog = await Blog.findById(request.params.id)
    
    if (!blog) { return response.status(401).json({ error: 'no blog with this id' })}

    if (user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'only the user who added the blog can delete it' })
    }

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