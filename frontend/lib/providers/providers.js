"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "@/lib/store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141414",
            color: "#f4f4f4",
            border: "1px solid #262626"
          }
        }}
      />
    </Provider>
  );
}
