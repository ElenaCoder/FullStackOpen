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
        author: 'Author A',
        url: 'http://example.com/1',
        likes: 2,
    },
    {
        _id: '2',
        title: 'Blog 2',
        author: 'Author B',
        url: 'http://example.com/2',
        likes: 3,
    },
    {
        _id: '3',
        title: 'Blog 3',
        author: 'Author C',
        url: 'http://example.com/3',
        likes: 7,
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
        assert.strictEqual(result, 12); // 2 + 3 + 7 = 12
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
            author: 'Author C',
            likes: 7,
        });
    });
});
