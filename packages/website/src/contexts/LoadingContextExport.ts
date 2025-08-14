import { createContext } from "react";

export interface GlobalLoadingState {
  [key: string]: {
    isLoading: boolean;
    message?: string;
    progress?: number;
    startTime?: number;
  };
}

export interface LoadingContextType {
  loadingStates: GlobalLoadingState;
  isGlobalLoading: boolean;
  setLoading: (key: string, isLoading: boolean, message?: string, progress?: number) => void;
  startLoading: (key: string, message?: string) => void;
  stopLoading: (key: string) => void;
  updateProgress: (key: string, progress: number) => void;
  updateMessage: (key: string, message: string) => void;
  isLoading: (key: string) => boolean;
  getLoadingState: (key: string) => GlobalLoadingState[string] | null;
  clearAll: () => void;
  getActiveTasks: () => string[];
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
