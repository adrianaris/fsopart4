const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0) 
}

const favoriteBlog = (blogs) => {
    const max = Math.max(...blogs.map(blog => { return  blog.likes }))
    
    const favBlog = blogs.find(blog => blog.likes === max)
    if (favBlog) {
        return {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes
        }
    } else {return {}}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}