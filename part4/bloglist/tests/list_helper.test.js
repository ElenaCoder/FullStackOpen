const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

// Test data: Empty list, one blog, multiple blogs
const emptyList = [];

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
    },
];

const multipleBlogs = [
    {
        _id: '1',
        title: 'Blog 1',
        author: 'Robert C. Martin',
        url: 'http://example.com/1',
        likes: 2,
    },
    {
        _id: '2',
        title: 'Blog 2',
        author: 'Edsger W. Dijkstra',
        url: 'http://example.com/2',
        likes: 3,
    },
    {
        _id: '3',
        title: 'Blog 3',
        author: 'Robert C. Martin',
        url: 'http://example.com/3',
        likes: 7,
    },
    {
        _id: '4',
        title: 'Blog 4',
        author: 'Edsger W. Dijkstra',
        url: 'http://example.com/4',
        likes: 4,
    },
    {
        _id: '5',
        title: 'Blog 5',
        author: 'Robert C. Martin',
        url: 'http://example.com/5',
        likes: 1,
    },
];

describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = [];
        const result = listHelper.dummy(blogs);
        assert.strictEqual(result, 1);
    });
});

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList);
        assert.strictEqual(result, 0);
    });

    test('when list has only one blog, equals the likes of that blog', () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        assert.strictEqual(result, 5);
    });

    test('of a bigger list is calculated correctly', () => {
        const result = listHelper.totalLikes(multipleBlogs);
        assert.strictEqual(result, 17); // 2 + 3 + 7 + 4 + 1= 12
    });
});

describe('favorite blog', () => {
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog(emptyList);
        assert.strictEqual(result, null);
    });

    test('when list has only one blog, return that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog);
        assert.deepStrictEqual(result, {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
        });
    });

    test('of a bigger list is the one with most likes', () => {
        const result = listHelper.favoriteBlog(multipleBlogs);
        assert.deepStrictEqual(result, {
            title: 'Blog 3',
            author: 'Robert C. Martin',
            likes: 7,
        },);
    });
});

describe('most blogs', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostBlogs(emptyList);
        assert.strictEqual(result, null);
    });

    test('when list has only one blog, returns that author with one blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog);
        assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 });
    });

    test('of a bigger list returns the author with the most blogs', () => {
        const result = listHelper.mostBlogs(multipleBlogs);
        assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 });
    });
});