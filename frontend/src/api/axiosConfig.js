import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

axios.defaults.baseURL = API_BASE;

export const getApiBase = () => API_BASE;

export default axios;
