import { Route, Routes } from "react-router";
import "./App.css";
import IndexPage from "@/pages/index-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
