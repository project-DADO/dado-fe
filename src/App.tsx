import { BrowserRouter, Routes, Route } from "react-router-dom"; // 💡 라우터 컴포넌트 임포트
import MainPage from "./pages/mainPage.tsx";
import DrawingWithpaint from "./pages/drawingWithpaint.tsx"; // 💡 새로 만든 그림판 페이지 임포트

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 기본 경로('/')일 때는 기존 메인 페이지를 보여줍니다. */}
        <Route path="/" element={<MainPage />} />

        {/* 2. '/drawing-paint' 경로로 들어오면 그림판 페이지를 보여줍니다. */}
        <Route path="/drawing-paint" element={<DrawingWithpaint />} />
      </Routes>
    </BrowserRouter>
  );
}
