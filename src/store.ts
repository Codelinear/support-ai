import { create } from "zustand";

interface AppState {
  screen: "home" | "chat" | "contact";
  responseLoading: boolean;
  chatStatus: "startChat" | "chatting" | "returnChat";
  userName: string;
  changeScreen: (screen: "home" | "chat" | "contact") => void;
  setResponseLoading: (status: boolean) => void;
  setChatStatus: (chatStatus: "startChat" | "chatting" | "returnChat") => void;
  setUserName: (name: string) => void;
}

export const useStore = create<AppState>((set) => ({
  screen: "home",
  responseLoading: false,
  chatStatus: "startChat",
  userName: "",
  changeScreen: (screen: "home" | "chat" | "contact") =>
    set(() => ({ screen })),
  setResponseLoading: (status: boolean) =>
    set(() => ({ responseLoading: status })),
  setChatStatus: (chatStatus: "startChat" | "chatting" | "returnChat") =>
    set(() => ({ chatStatus })),
  setUserName: (name: string) => set(() => ({ userName: name })),
}));
