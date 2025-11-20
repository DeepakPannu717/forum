// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getForumData = async () => {
  const res = await axios.get(`${API_URL}/forum`);
  // Normalize to always return an array of categories
  // Backend may return an array or an object { categories: [...] }
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.categories)) return res.data.categories;
  // Fallback: try to extract categories field or return empty array
  return res.data?.categories || [];
};

export const createCategory = async (categoryData) => {
  // categoryData can be either { name } for main category
  // or { name, parentId } for subcategory
  const res = await axios.post(`${API_URL}/category`, categoryData);
  return res.data;
};

export const createTopic = async (topicData) => {
  const res = await axios.post(`${API_URL}/topic`, topicData);
  return res.data;
};

export const createList = async (title, topicId) => {
  const res = await axios.post(`${API_URL}/list`, { title, topicId });
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
};

export const updateTopic = async (topicId, topicData) => {
  try {
    console.log('Updating topic with data:', { topicId, topicData });
    const res = await axios.put(`${API_URL}/topic/${topicId}`, topicData);
    console.log('Update response:', res.data);
    return res.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};


const api = axios.create({
  baseURL: "http://localhost:5000",  // Change if backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
