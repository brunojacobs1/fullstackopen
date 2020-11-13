import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, likeBlog, commentBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Button,
  Paper
} from '@material-ui/core';
import { useStyles } from '../theme';

const Blog = ({ blog }) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell>{blog.title}</TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          className={classes.tableButton}
          onClick={() => history.push(`/blogs/${blog.id}`)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const BlogInfo = ({ blog, user }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector((state) => state.users);

  if (!blog) {
    return null;
  }

  const blogUser = blog.user.name
    ? blog.user
    : users.find((u) => u.id === blog.user);

  const increaseLikes = (event) => {
    event.preventDefault();
    if (!user) {
      return dispatch(
        setNotification('You must log in to like a blog', 'error', 5)
      );
    }
    dispatch(
      likeBlog({
        ...blog,
        likes: blog.likes + 1,
      })
    );
    dispatch(setNotification(`Liked ${blog.title}`, 'success', 6));
  };

  const removeBlog = (event) => {
    event.preventDefault();
    dispatch(deleteBlog(blog.id));
    dispatch(
      setNotification(`Successfully removed ${blog.title}`, 'success', 6)
    );
    history.push('/');
  };

  const addComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    if (comment !== '') {
      event.target.comment.value = '';
      dispatch(commentBlog(blog.id, comment));
      dispatch(setNotification('Added comment', 'success', 5));
    }
  };

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes <button onClick={increaseLikes}>like</button>
      </p>
      <p>added by {blogUser.name}</p>
      {user ? (
        user.name === blogUser.name ? (
          <button onClick={removeBlog}>remove</button>
        ) : null
      ) : null}
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <div>
          <input id="comment" type="text"></input>
          <button>add comment</button>
        </div>
      </form>
      {blog.comments ? (
        <ul>
          {blog.comments.map((c) => (
            <li key={c.id}>{c.comment}</li>
          ))}
        </ul>
      ) : (
        <em>no comments</em>
      )}
    </div>
  );
};

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.currentUser);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} user={user} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BlogList;
