const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((total, blog) => {
        return total + blog.likes;
      }, 0);
};

const getFavorite = (blogs) => {
  if (blogs.length > 0) {
    const { title, author, likes } = blogs.reduce((prev, current) => {
      return prev.likes > current.likes ? prev : current;
    });
    return { title, author, likes };
  } else {
    return -1;
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length) {
    const blogsByAuthor = _.countBy(blogs, 'author');
    const mostBlogs = _.max(_.toArray(blogsByAuthor));
    return {
      author: _.findKey(blogsByAuthor, (a) => a === mostBlogs),
      blogs: mostBlogs,
    };
  } else {
    return -1;
  }
};

const mostLikes = (blogs) => {
  if (blogs.length) {
    const blogsByAuthor = _.groupBy(blogs, 'author');
    const arr = _.toArray(blogsByAuthor);
    const authorLikes = arr.map((x) =>
      x.length > 1
        ? x.reduce((curr, prev) => {
            return { author: curr.author, likes: curr.likes + prev.likes };
          })
        : { author: x[0].author, likes: x[0].likes }
    );
    return _.maxBy(authorLikes, 'likes');
  } else {
    return -1;
  }
};

module.exports = {
  dummy,
  totalLikes,
  getFavorite,
  mostBlogs,
  mostLikes,
};
