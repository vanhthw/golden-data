import GameCanvas from '../features/game/GameCanvas'
import Hud from '../features/hud/Hud'
import HudPanels from '../features/hud/HudPanels'
import ProjectModal from '../features/project-modal/ProjectModal'

export default function GameScreen() {
    return (
        <main className="relative h-full w-full overflow-hidden">
            <GameCanvas />
            <Hud />
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-sm text-parchment/80">
                Nhấn SPACE hoặc chạm màn hình để thả móc
            </p>
            <HudPanels />
            <ProjectModal />
        </main>
    )
}