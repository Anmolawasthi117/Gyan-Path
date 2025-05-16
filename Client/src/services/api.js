import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

export const fetchNodesApi = () => api.get('/map/nodes');
export const searchNodesApi = (name) => api.get(`/map/search?name=${encodeURIComponent(name)}`);
export const calculateRoute = ({ startNodeId, endNodeId }) =>
  api.post('/map/route', { startId: startNodeId, endId: endNodeId });