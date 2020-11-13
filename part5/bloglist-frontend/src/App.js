import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const messageTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
  };
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception);
      setMessage('Wrong username or password');
      setMessageType(messageTypes.ERROR);
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.create(blogObject);
    setBlogs([...blogs, newBlog]);
    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`);
    setMessageType(messageTypes.SUCCESS);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  const updateBlog = async (blog) => {
    const blogToLike = blogs.find((b) => b.id === blog.id);
    const changedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
    };
    await blogService.update(changedBlog, blog.id);
    setBlogs(blogs.map((b) => (b.id !== blog.id ? b : changedBlog)));
    setMessage(`liked ${blog.title}`);
    setMessageType(messageTypes.SUCCESS);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  const deleteBlog = async (blogId) => {
    const blogToDelete = blogs.find((b) => b.id === blogId);
    await blogService.remove(blogId);
    setBlogs(blogs.filter((b) => b.id !== blogId));
    setMessage(`removed ${blogToDelete.title}`);
    setMessageType(messageTypes.SUCCESS);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  return (
    <div>
      <h2>blogs</h2>
      {user ? (
        <div>
          <Notification message={message} type={messageType} />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} forwardRef={blogFormRef} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            ))}{' '}
        </div>
      ) : (
        <div>
          <Notification message={message} type={messageType} />
          {loginForm()}
        </div>
      )}
    </div>
  );
};

export default App;
