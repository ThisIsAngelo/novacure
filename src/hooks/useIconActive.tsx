import { create } from "zustand";

type useIconActiveProps = {
  isActive: string;
  setIsActive: (name: string) => void;
};

export const useIconActive = create<useIconActiveProps>((set) => ({
    isActive: "dashboard",
    setIsActive: (name) => set({ isActive: name }),
}))