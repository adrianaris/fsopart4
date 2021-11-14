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
    
    const listWithTwoBlogs = [
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            id:'5a422aa71b54a676234d17f8' 
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            id:'5a422aa71b54a676234d17f9'            
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 299,
            id:'5a422aa71b54a676234d17f1'            
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 7,
            id:'5a422aa71b54a676234d17f2'            
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 2,
            id:'5a422aa71b54a676234d17f3'            
        }
    ]

    test('of a bigger list', () => {
        const result = listHelper.totalLikes(listWithTwoBlogs)
        expect(result).toBe(318)
    })

    test('favorite blog test for list with multiple blogs', () => {
        const blog = listHelper.favoriteBlog(listWithTwoBlogs)
        expect(blog).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 299 
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
})