import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ContextProvide } from "./contexts/ContextProvider.jsx";
import "./index.css";
import router from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvide>
      <RouterProvider router={router} />
    </ContextProvide>
  </StrictMode>
);
