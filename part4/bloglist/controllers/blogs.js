const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  if (!req.token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201);
  res.json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const blogToBeDeleted = await Blog.findById(req.params.id);
  console.log(blogToBeDeleted);
  console.log(decodedToken);
  if (blogToBeDeleted.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } else {
    return res
      .status(401)
      .json({ error: 'authenticated user is not the creator of the blog' });
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  const body = req.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: user._id,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (req, res) => {
  const comment = req.body.comment;
  const id = new mongoose.Types.ObjectId();
  const blogToAddComment = await Blog.findById(req.params.id);
  blogToAddComment.comments.push({ id: id, comment: comment });
  await blogToAddComment.save()
  res.json({ id: id, comment: comment });
});

module.exports = blogsRouter;
