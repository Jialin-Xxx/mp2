import axios from "axios";

export const api = axios.create({
  baseURL: "https://hp-api.onrender.com/api",
  timeout: 10000,
});

const cache = new Map<string, any>();
export async function get<T = any>(url: string) {
  if (cache.has(url)) return cache.get(url) as T;
  const { data } = await api.get<T>(url);
  cache.set(url, data);
  return data;
}
