import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api/axios";

const initialState = {
  items: [],
  isLoading: false,
  isGenerating: false,
  isUploading: false,
  error: null
};

export const fetchImages = createAsyncThunk(
  "images/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/images");
      return data.images;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load images");
    }
  }
);

export const generateImage = createAsyncThunk(
  "images/generate",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/images/generate", payload);
      return data.image;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Image generation failed");
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "images/favorite",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/images/favorite/${id}`);
      return data.image;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update favorite");
    }
  }
);

export const uploadMockImage = createAsyncThunk(
  "images/upload",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/images/upload", payload);
      return data.image;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Mock upload failed");
    }
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(generateImage.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.items.unshift(action.payload);
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(uploadMockImage.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadMockImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.items.unshift(action.payload);
      })
      .addCase(uploadMockImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      });
  }
});

export default imagesSlice.reducer;
