import { Navigate, Route, Routes } from "react-router";
import IndexPage from "./pages/index-page";
import GlobalLayout from "./components/layout/global-layout";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" element={<IndexPage />} />

        <Route path="*" element={<Navigate to={"/"} />} />
      </Route>
    </Routes>
  );
}
