import React, { useState } from 'react';
const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeBlog = () => {
    updateBlog(blog);
  };

  const removeBlog = () => {
    deleteBlog(blog.id);
  };

  return (
    <div style={blogStyle}>
      <div>
        {!visible ? (
          <div className="blog">
            {blog.title} {blog.author}
            <button id="view-button" onClick={() => setVisible(!visible)}>
              view
            </button>
          </div>
        ) : (
          <div className="togglableContent">
            {blog.title}{' '}
            <button onClick={() => setVisible(!visible)}>hide</button>
            <p>{blog.url}</p>
            <p>
              likes {blog.likes}{' '}
              <button id="like-button" onClick={likeBlog}>
                like
              </button>
            </p>
            <p>{blog.author}</p>
            <button id="remove-button" onClick={removeBlog}>remove</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
