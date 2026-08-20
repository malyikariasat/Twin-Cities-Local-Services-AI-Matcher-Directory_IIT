import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://twin-cities-local-services-ai-match-rust.vercel.app/api"
);

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;