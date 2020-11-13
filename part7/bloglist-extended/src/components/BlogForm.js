import React from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const messageTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const BlogForm = ({ forwardRef }) => {
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    forwardRef.current.toggleVisibility();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    if (title !== '' && author !== '' && url !== '') {
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.url.value = '';
      dispatch(
        createBlog({
          title: title,
          author: author,
          url: url,
        })
      );
      dispatch(
        setNotification(
          `Blog: ${title} successfully created`,
          messageTypes.SUCCESS,
          6
        )
      );
    }
  };

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={addBlog} className="form">
        <div>
          <label>title:</label>
          <input id="title" type="text" name="Title"></input>
        </div>
        <div>
          <label>author:</label>
          <input id="author" type="text" name="Author"></input>
        </div>
        <div>
          <label>url:</label>
          <input id="url" type="text" name="Url"></input>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
