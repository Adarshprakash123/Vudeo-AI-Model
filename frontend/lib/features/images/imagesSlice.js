import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  isGenerating: false,
  isUploading: false,
  error: null
};

const aspectMap = {
  "1:1": "900/900",
  "16:9": "1280/720",
  "9:16": "720/1280",
  "4:5": "800/1000"
};

function buildMockImage({ prompt, aspectRatio = "1:1", source = "generated", imageUrl }) {
  const createdAt = new Date().toISOString();
  const size = aspectMap[aspectRatio] || aspectMap["1:1"];
  const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  return {
    _id: `mock-${seed}`,
    prompt: prompt?.trim() || "Untitled media",
    imageUrl: imageUrl || `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}`,
    aspectRatio,
    source,
    isFavorite: false,
    createdAt
  };
}

export const fetchImages = createAsyncThunk(
  "images/fetchAll",
  async () => {
    return [];
  }
);

export const generateImage = createAsyncThunk(
  "images/generate",
  async (payload) => {
    return buildMockImage({
      prompt: payload.prompt,
      aspectRatio: payload.aspectRatio,
      source: "generated"
    });
  }
);

export const toggleFavorite = createAsyncThunk(
  "images/favorite",
  async (id, { getState, rejectWithValue }) => {
    const item = getState().images.items.find((entry) => entry._id === id);

    if (!item) {
      return rejectWithValue("Failed to update favorite");
    }

    return {
      ...item,
      isFavorite: !item.isFavorite
    };
  }
);

export const uploadMockImage = createAsyncThunk(
  "images/upload",
  async (payload) => {
    return buildMockImage({
      prompt: payload.prompt || "Uploaded reference media",
      imageUrl: payload.imageUrl,
      source: "uploaded"
    });
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
