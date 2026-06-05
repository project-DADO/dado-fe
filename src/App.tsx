import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage.tsx";
import DrawingPaintPage from "./pages/drawingPaintPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/drawing-paint" element={<DrawingPaintPage />} />
      </Routes>
    </BrowserRouter>
  );
}
