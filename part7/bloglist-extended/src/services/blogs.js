import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
};

const comment = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, comment);
  return response.data;
};

const update = async (updatedBlog, id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};

export default { getAll, setToken, create, update, remove, comment };
