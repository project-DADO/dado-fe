import { Navigate, Route, Routes } from "react-router";
import MainPage from "./pages/mainPage";
import GlobalLayout from "./components/layout/global-layout";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" element={<MainPage />} />

        <Route path="*" element={<Navigate to={"/"} />} />
      </Route>
    </Routes>
  );
}
