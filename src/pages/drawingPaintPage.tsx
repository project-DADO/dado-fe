import { useNavigate, useLocation } from "react-router-dom";
import DrawingWithPaint from "./drawingWithPaint";
import { useDrawingsStore } from "../store/drawings-store";

interface LocationState {
  date?: string;
}

export default function DrawingPaintPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetDate = useDrawingsStore((s) => s.targetDate);
  const saveDrawing = useDrawingsStore((s) => s.saveDrawing);

  const selectedDate =
    (location.state as LocationState | null)?.date || targetDate;

  const handleInsert = (imgDataUrl: string) => {
    if (!selectedDate) return;
    saveDrawing(selectedDate, imgDataUrl);
    navigate("/");
  };

  if (!selectedDate) {
    navigate("/");
    return null;
  }

  return (
    <DrawingWithPaint onInsert={handleInsert} selectedDate={selectedDate} />
  );
}
