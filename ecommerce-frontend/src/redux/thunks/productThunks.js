import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { mockProducts } from "../../assets/mockProducts";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/products", { params });
    if (data && data.products && data.products.length > 0) return data;
    return filterMockProducts(params); // <--- FALLBACK TO MOCK DATA IF DB IS EMPTY
  } catch (err) {
    return filterMockProducts(params); // <--- FALLBACK TO MOCK DATA IF DB FAILS
  }
});

// Helper function to handle search, category filter, and sorting on local mock data
function filterMockProducts(params) {
  let filtered = [...mockProducts];

  if (params.category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }
  if (params.keyword) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(params.keyword.toLowerCase()));
  }
  if (params.minPrice) {
    filtered = filtered.filter(p => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
  }

  if (params.sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (params.sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return {
    products: filtered,
    total: filtered.length,
    pages: 1,
    page: 1,
  };
}

export const fetchProductById = createAsyncThunk("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data.product;
  } catch (err) {
    const mock = mockProducts.find(p => p.id === id || p._id === id);
    if (mock) return mock;
    return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
  }
});

export const fetchCategories = createAsyncThunk("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/products/categories");
    if (data && data.categories && data.categories.length > 0) {
      return data.categories;
    }
    return Array.from(new Set(mockProducts.map(p => p.category)));
  } catch (err) {
    return Array.from(new Set(mockProducts.map(p => p.category)));
  }
});

export const fetchRecommendations = createAsyncThunk("products/fetchRecommendations", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/analytics/recommendations/${productId}`);
    return data.recommendations;
  } catch (err) {
    return mockProducts.slice(0, 6);
  }
});