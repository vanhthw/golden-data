import GameButton from '../components/ui/GameButton'
import { useGameStore } from '../store/useGameStore'

export default function IntroScreen() {
    const start = useGameStore((s) => s.start)
    return (
        <main className="bg-intro flex h-full flex-col items-center justify-center gap-5 overflow-hidden p-6 text-center">
            <div className="animate-bounce text-7xl sm:text-8xl">⛏️</div>
            <h1 className="text-5xl text-wood-dark drop-shadow-[0_4px_0_var(--color-parchment)] sm:text-7xl">
                GOLD MINER
            </h1>
            <p className="text-2xl text-wood-dark sm:text-3xl">Data Analyst Edition</p>
            <p className="max-w-md text-lg text-parchment">
                Thả móc đào kho báu dữ liệu: mỗi viên vàng là một dự án phân tích.
            </p>
            <GameButton size="lg" onClick={start}>
                ▶ BẮT ĐẦU
            </GameButton>
        </main>
    )
}