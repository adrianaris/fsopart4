const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            id:'5a422aa71b54a676234d17f8' 
        }
    ]
    
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    
    test('favorite blog test for list with one blog', () => {
        const blog = listHelper.favoriteBlog(listWithOneBlog)
        expect(blog).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })
    
    test('most blogs test for list with one blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })
    
    test('most likes test for list with one blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })
    
    const listWithMoreBlogs = [
        {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
        },
        {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
        },
        {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
        },
        {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
        },
        {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
        },
        {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
        }  
    ]

    test('total likes test of a bigger list', () => {
        const result = listHelper.totalLikes(listWithMoreBlogs)
        expect(result).toBe(36)
    })

    test('favorite blog test for list with multiple blogs', () => {
        const blog = listHelper.favoriteBlog(listWithMoreBlogs)
        expect(blog).toEqual({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12 
        })
    })
    
    test('most blogs test for list with multiple blogs', () => {
        const result = listHelper.mostBlogs(listWithMoreBlogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
    
    test('most likes test for list with multiple blogs', () => {
        const result = listHelper.mostLikes(listWithMoreBlogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })

    const emptyList = []
    test('empty list', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })

    test('favorite blog test for empty list', () => {
        const blog = listHelper.favoriteBlog(emptyList)
        expect(blog).toEqual({})
    })
    
    test('most blogs test for empty list', () => {
        const result = listHelper.mostBlogs(emptyList)
        expect(result).toEqual({})
    })
    
    test('most likes test for empty list', () => {
        const result = listHelper.mostLikes(emptyList)
        expect(result).toEqual({})
    })
})