const mongoose = require('mongoose');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const api = supertest(app);

describe('blog api', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();

    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: user.id })
    );
    const promiseArray = blogObjects.map((blog) => blog.save());

    await Promise.all(promiseArray);
  });
  test('should return blogs in JSON format', async () => {
    const blogs = await helper.blogsInDb();
    console.log(blogs);
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('should return correct amount of blogs', async () => {
    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length);
  });

  test('should have a unique identifier property named id for each blog', async () => {
    const blogs = await helper.blogsInDb();
    blogs.forEach((blog) => expect(blog.id).toBeDefined());
  });

  test('should fail to add a blog with proper status code if a token is not provided', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'jest',
      url: 'http://jest.com',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('should be able to create a new valid blog', async () => {
    const user = {
      username: 'root',
      password: 'sekret',
    };
    const authenticatedUser = await api
      .post('/api/login')
      .send(user)
      .expect(200);
    const newBlog = {
      title: 'new blog',
      author: 'jest',
      url: 'http://jest.com',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${authenticatedUser.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogs.map((b) => b.title);
    expect(titles).toContain('new blog');
  });

  test('should default the likes property of a blog to 0 if not defined in the request', async () => {
    const user = {
      username: 'root',
      password: 'sekret',
    };
    const authenticatedUser = await api
      .post('/api/login')
      .send(user)
      .expect(200);
    const newBlog = {
      title: 'new blog',
      author: 'jest',
      url: 'http://jest.com',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${authenticatedUser.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
    const blogWithLikes = blogs.find((b) => b.title === 'new blog');
    expect(blogWithLikes.likes).toBeDefined();
  });

  test('should respond with 400 if a post request is missing the title and url properties', async () => {
    const user = {
      username: 'root',
      password: 'sekret',
    };
    const authenticatedUser = await api
      .post('/api/login')
      .send(user)
      .expect(200);
    const newBlog = {
      author: 'jest',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${authenticatedUser.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('should be able to delete a blog if the user is the creator and respond with status code 204', async () => {
    const blogs = await helper.blogsInDb();
    const user = {
      username: 'root',
      password: 'sekret',
    };
    const authenticatedUser = await api
      .post('/api/login')
      .send(user)
      .expect(200);
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `bearer ${authenticatedUser.body.token}`)
      .expect(204);
  });

  test('should be able to update a blog post', async () => {
    const user = {
      username: 'root',
      password: 'sekret',
    };
    const authenticatedUser = await api
      .post('/api/login')
      .send(user)
      .expect(200);
    const decodedToken = jwt.verify(
      authenticatedUser.body.token,
      process.env.SECRET
    );

    const updatedBlog = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10,
      comments: [],
      user: decodedToken.id,
    };

    const resultBlog = await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .set('Authorization', `bearer ${authenticatedUser.body.token}`)
      .send(updatedBlog);
    console.log(resultBlog.body);
    expect(resultBlog.body).toEqual(updatedBlog);
  });

  describe('when there is initially one user in db', () => {
    beforeEach(async () => {});
    test('should successfully create a user', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        name: 'Bruno',
        username: 'bjs',
        password: 'testp',
      };
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });
    describe('when the request is invalid', () => {
      test('should respond accordingly if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
          username: 'root',
          name: 'invalid',
          password: 'invalid',
        };
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
      });
      test('should respond accordingly if password is invalid', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
          username: 'ayy',
          name: 'invalid',
        };
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(result.body.error).toBe('password not provided or too short');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
