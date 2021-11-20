const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) =>{
    const bloglist = await Blog.find({})
    response.json(bloglist)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes === undefined ? 0 : request.body.likes
    })

    await blog.save()
    
    response.status(201).json(blog.save())
})

module.exports = blogRouter