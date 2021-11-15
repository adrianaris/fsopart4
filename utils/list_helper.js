const blog = require("../models/blog")
const _ = require('lodash')

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

const mostBlogs = (blogs) => {
    const count = _.countBy(blogs.map(blog => blog.author))
    const maxCount= Object.entries(count).reduce((a, b) => count[a] > count[b] ? a : b, 0)

    return {
        author: maxCount[0],
        blogs: maxCount[1]
    }
}

const mostLikes = (blogs) => {
    const authors = _.sortedUniq(blogs.map(blog => blog.author))
    var likesList = []
    authors.forEach(author => {
        return likesList.push({
            author: author,
            likes: _.reduce(blogs.filter(blog => blog.author === author), (sum, blog) => sum + blog.likes, 0)
        })    
    })
    
    return likesList.reduce((a, b) => a.likes > b.likes ? a : b, {})
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}