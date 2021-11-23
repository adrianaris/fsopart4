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