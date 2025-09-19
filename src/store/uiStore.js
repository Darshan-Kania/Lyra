// UI Store - manages global UI state like loading overlays
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set, get) => ({
      // number of ongoing requests
      globalLoadingCount: 0,

      // start/stop global loading (safe against underflow)
      startGlobalLoading: () => set(state => ({ globalLoadingCount: state.globalLoadingCount + 1 })),
      stopGlobalLoading: () => set(state => ({ globalLoadingCount: Math.max(0, state.globalLoadingCount - 1) })),

      // utility to reset (e.g., after hard errors)
      resetGlobalLoading: () => set({ globalLoadingCount: 0 }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // it's safe to persist count in case of reloads; still guarded by Math.max
        globalLoadingCount: state.globalLoadingCount,
      })
    }
  )
);

export default useUiStore;
