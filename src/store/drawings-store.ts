import { create } from "zustand";

interface DrawingsState {
  drawings: Record<string, string>;
  targetDate: string;
  setTargetDate: (date: string) => void;
  saveDrawing: (date: string, imgDataUrl: string) => void;
}

export const useDrawingsStore = create<DrawingsState>((set) => ({
  drawings: {},
  targetDate: "",
  setTargetDate: (date) => set({ targetDate: date }),
  saveDrawing: (date, imgDataUrl) =>
    set((state) => ({
      drawings: { ...state.drawings, [date]: imgDataUrl },
    })),
}));
