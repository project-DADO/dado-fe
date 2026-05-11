import { createRoot } from "react-dom/client";
//import "./index.css";
import App from "./App.tsx";
//import mainPage from "./pages/mainPage.tsx";
import "./css/mainPage.css";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
