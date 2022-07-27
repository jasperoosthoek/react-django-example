import axios from 'axios';

// axios instance for our Backend
export default axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });
