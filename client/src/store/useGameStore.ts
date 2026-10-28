import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Domain, Level } from '../types/project'

export type Screen = 'intro' | 'game'
export type Panel = 'settings' | 'level' | 'domain' | null

interface GameState {
    screen: Screen
    level: Level | 'all'
    domain: Domain | 'all'
    soundOn: boolean
    openedIds: string[]
    activeProjectId: string | null
    panel: Panel
    start: () => void
    backToIntro: () => void
    setLevel: (v: Level | 'all') => void
    setDomain: (v: Domain | 'all') => void
    toggleSound: () => void
    setPanel: (p: Panel) => void
    openProject: (id: string) => void
    closeProject: () => void
    resetProgress: () => void
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            screen: 'intro',
            level: 'all',
            domain: 'all',
            soundOn: true,
            openedIds: [],
            activeProjectId: null,
            panel: null,
            start: () => set({ screen: 'game' }),
            backToIntro: () => set({ screen: 'intro', panel: null, activeProjectId: null }),
            setLevel: (level) => set({ level }),
            setDomain: (domain) => set({ domain }),
            toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
            setPanel: (panel) => set({ panel }),
            openProject: (id) =>
                set((s) => ({
                    activeProjectId: id,
                    openedIds: s.openedIds.includes(id) ? s.openedIds : [...s.openedIds, id],
                })),
            closeProject: () => set({ activeProjectId: null }),
            resetProgress: () => set({ openedIds: [] }),
        }),
        {
            name: 'gold-miner-v1',
            // Chỉ lưu cài đặt và tiến độ, không lưu trạng thái popup/màn hình
            partialize: (s) => ({
                level: s.level,
                domain: s.domain,
                soundOn: s.soundOn,
                openedIds: s.openedIds,
            }),
        },
    ),
)