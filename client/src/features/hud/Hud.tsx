import GameButton from '../../components/ui/GameButton'
import { useGameStore } from '../../store/useGameStore'
import { TOTAL_PROJECTS } from '../../services/projectService'

export default function Hud() {
    const setPanel = useGameStore((s) => s.setPanel)
    const backToIntro = useGameStore((s) => s.backToIntro)
    const opened = useGameStore((s) => s.openedIds.length)

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
            <div className="pointer-events-auto flex items-center gap-2">
                <GameButton icon variant="ghost" onClick={backToIntro} aria-label="Trang chủ" title="Trang chủ">
                    🏠
                </GameButton>
                <div className="rounded-xl border-4 border-wood-dark bg-parchment px-3 py-1 text-xl text-wood-dark">
                    ⭐ {opened}/{TOTAL_PROJECTS}
                </div>
            </div>

            <div className="pointer-events-auto flex gap-2">
                <GameButton icon onClick={() => setPanel('settings')} aria-label="Cài đặt" title="Cài đặt">
                    ⚙️
                </GameButton>
                <GameButton icon onClick={() => setPanel('level')} aria-label="Độ khó" title="Độ khó">
                    🏆
                </GameButton>
                <GameButton icon onClick={() => setPanel('domain')} aria-label="Lĩnh vực" title="Lĩnh vực">
                    🗂️
                </GameButton>
            </div>
        </div>
    )
}