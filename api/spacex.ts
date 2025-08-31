import axios from 'axios';
import type { Launch, Launchpad, LaunchesQuery, LaunchesResponse } from '../types/spacex';

const BASE_URL = 'https://api.spacexdata.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const spacexApi = {
  // Get paginated launches with query support
  async getLaunches(query: LaunchesQuery): Promise<LaunchesResponse> {
    try {
      const response = await api.post<LaunchesResponse>('/v5/launches/query', query);
      return response.data;
    } catch (error) {
      console.error('Error fetching launches:', error);
      throw new Error('Failed to fetch launches');
    }
  },

  // Get all launches (for search functionality)
  async getAllLaunches(): Promise<Launch[]> {
    try {
      const response = await api.get<Launch[]>('/v5/launches');
      return response.data;
    } catch (error) {
      console.error('Error fetching all launches:', error);
      throw new Error('Failed to fetch launches');
    }
  },

  // Get specific launch by ID
  async getLaunch(id: string): Promise<Launch> {
    try {
      const response = await api.get<Launch>(`/v5/launches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching launch:', error);
      throw new Error('Failed to fetch launch details');
    }
  },

  // Get launchpad details
  async getLaunchpad(id: string): Promise<Launchpad> {
    try {
      const response = await api.get<Launchpad>(`/v4/launchpads/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching launchpad:', error);
      throw new Error('Failed to fetch launchpad details');
    }
  },

  // Get all launchpads
  async getAllLaunchpads(): Promise<Launchpad[]> {
    try {
      const response = await api.get<Launchpad[]>('/v4/launchpads');
      return response.data;
    } catch (error) {
      console.error('Error fetching launchpads:', error);
      throw new Error('Failed to fetch launchpads');
    }
  },
};

export default spacexApi;
