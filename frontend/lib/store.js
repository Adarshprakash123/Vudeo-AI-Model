import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/features/auth/authSlice";
import imagesReducer from "@/lib/features/images/imagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imagesReducer
  }
});
