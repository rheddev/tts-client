import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TTSServer } from "./tts";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "/tts",
      element: <TTSServer/>,
    },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />
);
