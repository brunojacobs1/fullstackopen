import blogService from '../services/blogs';

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    });
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    });
  };
};

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    await blogService.remove(blogId);
    dispatch({
      type: 'DELETE_BLOG',
      blogId,
    });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog, blog.id);
    dispatch({
      type: 'LIKE',
      data: updatedBlog,
    });
  };
};

export const commentBlog = (blogId, comment) => {
  return async (dispatch) => {
    const response = await blogService.comment(blogId, { comment: comment });
    dispatch({
      type: 'COMMENT',
      blogId,
      comment,
      response,
    });
  };
};

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data;
    case 'NEW_BLOG':
      return [...state, action.data];
    case 'DELETE_BLOG': {
      const id = action.blogId;
      return state.filter((b) => b.id !== id);
    }
    case 'LIKE': {
      const id = action.data.id;
      const blogToLike = state.find((b) => b.id === id);
      const changedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
      };
      return state.map((b) => (b.id !== id ? b : changedBlog));
    }
    case 'COMMENT': {
      const id = action.blogId;
      const comment = action.comment;
      const blogToComment = state.find((b) => b.id === id);
      const changedBlog = {
        ...blogToComment,
        comments: [
          ...blogToComment.comments,
          { id: action.response.id, comment: comment },
        ],
      };
      return state.map((b) => (b.id !== id ? b : changedBlog));
    }
    default:
      return state;
  }
};

export default blogReducer;
