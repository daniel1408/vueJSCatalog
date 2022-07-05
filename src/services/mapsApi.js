import axios from "axios";

const HttpMap = axios.create({
  baseURL: 'https://viacep.com.br/',
  timeout: 0,
  headers: { "Content-Type": "application/json" },
});

export default HttpMap;


