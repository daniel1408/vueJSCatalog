import axios from "axios";

const Http = axios.create({
  baseURL: "http://ip-api.com/json",
  timeout: 0,
  headers: { "Content-Type": "application/json" },
});

export const getIp = () => Http.get("");
