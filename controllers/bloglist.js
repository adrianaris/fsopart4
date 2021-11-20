const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) =>{
    const bloglist = await Blog.find({})
    response.json(bloglist)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    await blog.save()
    
    response.status(201).json(blog.save())
})

module.exports = blogRouter