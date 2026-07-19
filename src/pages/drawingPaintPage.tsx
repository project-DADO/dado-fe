import { useNavigate, useLocation } from "react-router-dom";
import DrawingWithPaint from "./drawingWithPaint";
import {
  useDrawingsStore,
  getSaveErrorMessage,
} from "../store/drawings-store";

interface LocationState {
  date?: string;
}

export default function DrawingPaintPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetDate = useDrawingsStore((s) => s.targetDate);
  const saveDrawing = useDrawingsStore((s) => s.saveDrawing);
  const isSaving = useDrawingsStore((s) => s.isSaving);

  const selectedDate =
    (location.state as LocationState | null)?.date || targetDate;

  const handleInsert = async (imgDataUrl: string) => {
    if (!selectedDate) return;

    try {
      await saveDrawing(selectedDate, imgDataUrl);
      alert(`${selectedDate} 칸에 그림이 성공적으로 삽입되었습니다!`);
      navigate("/");
    } catch (error) {
      alert(getSaveErrorMessage(error));
    }
  };

  if (!selectedDate) {
    navigate("/");
    return null;
  }

  return (
    <DrawingWithPaint
      onInsert={handleInsert}
      selectedDate={selectedDate}
      isSaving={isSaving}
    />
  );
}
