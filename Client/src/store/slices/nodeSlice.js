import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNodesApi, searchNodesApi } from '../../services/api.js';

export const fetchNodes = createAsyncThunk('node/fetchNodes', async () => {
  const { data } = await fetchNodesApi();
  return data.data;
});

export const searchNodes = createAsyncThunk('node/searchNodes', async (name) => {
  const { data } = await searchNodesApi(name);
  return data.data;
});

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    nodes: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateNode: (state, action) => {
      const updatedNode = action.payload;
      if (updatedNode.deleted) {
        state.nodes = state.nodes.filter((node) => node.nodeId !== updatedNode.nodeId);
      } else {
        const index = state.nodes.findIndex((node) => node.nodeId === updatedNode.nodeId);
        if (index >= 0) {
          state.nodes[index] = updatedNode;
        } else {
          state.nodes.push(updatedNode);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nodes = action.payload;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(searchNodes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchNodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nodes = action.payload;
      })
      .addCase(searchNodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateNode } = nodeSlice.actions;
export default nodeSlice.reducer;