import { create } from "zustand";
import { uploadDirectImage } from "@/api/calendar-images";
import { dataUrlToFile } from "@/lib/image-utils";
import { ApiError } from "@/types/calendar-image";

const DEFAULT_CALENDAR_ID = Number(import.meta.env.VITE_CALENDAR_ID) || 1;

interface DrawingsState {
  drawings: Record<string, string>;
  targetDate: string;
  calendarId: number;
  isSaving: boolean;
  setTargetDate: (date: string) => void;
  saveDrawing: (date: string, imgDataUrl: string) => Promise<void>;
}

export const useDrawingsStore = create<DrawingsState>((set, get) => ({
  drawings: {},
  targetDate: "",
  calendarId: DEFAULT_CALENDAR_ID,
  isSaving: false,
  setTargetDate: (date) => set({ targetDate: date }),
  saveDrawing: async (date, imgDataUrl) => {
    const { calendarId } = get();
    set({ isSaving: true });

    try {
      const imageFile = await dataUrlToFile(imgDataUrl);
      const response = await uploadDirectImage({
        calendarId,
        recordDate: date,
        imageFile,
      });

      set((state) => ({
        drawings: {
          ...state.drawings,
          [date]: response.data.imageUrl,
        },
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("이미지 저장 중 오류가 발생했습니다.", 0);
    } finally {
      set({ isSaving: false });
    }
  },
}));

export function getSaveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "이미지 파일 형식이 올바르지 않습니다.";
    }
    if (error.status === 409) {
      return "해당 날짜에 이미 등록된 이미지가 있습니다. (하루 한 장 제약)";
    }
    return error.message;
  }
  return "이미지 저장 중 오류가 발생했습니다.";
}
