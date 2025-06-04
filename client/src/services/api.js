// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getForumData = async () => {
  const res = await axios.get(`${API_URL}/forum`);
  return res.data;
};

export const createCategory = async (name) => {
  const res = await axios.post(`${API_URL}/forum/category`, { name });
  return res.data;
};

export const createTopic = async (name, categoryId) => {
  const res = await axios.post(`${API_URL}/forum/topic`, { name, categoryId });
  return res.data;
};

export const createList = async (title, topicId) => {
  const res = await axios.post(`${API_URL}/forum/list`, { title, topicId });
  return res.data;
};

export const getCategories = async () => {
  const response = await fetch('/api/categories');
  return response.json();
};



const api = axios.create({
  baseURL: "http://localhost:5000",  // Change if backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
