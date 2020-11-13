import React, { useState } from 'react';

const BlogForm = ({ createBlog, forwardRef }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const addBlog = (event) => {
    event.preventDefault();
    forwardRef.current.toggleVisibility();
    if (title !== '' && author !== '' && url !== '') {
      setTitle('');
      setAuthor('');
      setUrl('');
      createBlog({
        title,
        author,
        url,
      });
    }
  };

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={addBlog} className="form">
        <div>
          <label>title:</label>
          <input id="title" value={title} onChange={handleTitleChange}></input>
        </div>
        <div>
          <label>author:</label>
          <input id="author" value={author} onChange={handleAuthorChange}></input>
        </div>
        <div>
          <label>url:</label>
          <input id="url" value={url} onChange={handleUrlChange}></input>
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
