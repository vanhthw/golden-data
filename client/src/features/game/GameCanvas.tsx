import { useEffect, useMemo, useRef } from 'react'
import { GameEngine } from './engine/GameEngine'
import { useGameStore } from '../../store/useGameStore'
import { getProjects } from '../../services/projectService'

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<GameEngine | null>(null)

    const level = useGameStore((s) => s.level)
    const domain = useGameStore((s) => s.domain)
    const openedIds = useGameStore((s) => s.openedIds)
    const paused = useGameStore((s) => s.activeProjectId !== null || s.panel !== null)
    const openProject = useGameStore((s) => s.openProject)

    const projects = useMemo(() => getProjects({ level, domain }), [level, domain])

    // Khởi tạo engine 1 lần
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const engine = new GameEngine(canvas, { onCollect: (id) => openProject(id) })
        engineRef.current = engine
        engine.start()
        const ro = new ResizeObserver(() => engine.resize())
        ro.observe(canvas)
        return () => {
            ro.disconnect()
            engine.destroy()
            engineRef.current = null
        }
    }, [openProject])

    // Đồng bộ dữ liệu từ store vào engine (chỉ khi có SỰ KIỆN, không phải mỗi frame)
    useEffect(() => {
        engineRef.current?.setProjects(projects)
    }, [projects])

    useEffect(() => {
        engineRef.current?.setVisited(new Set(openedIds))
    }, [openedIds])

    useEffect(() => {
        engineRef.current?.setPaused(paused)
    }, [paused])

    // Phím Space / mũi tên xuống để thả móc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const engine = engineRef.current
            if (!engine || engine.isPaused()) return
            if (e.code === 'Space' || e.code === 'ArrowDown') {
                e.preventDefault()
                engine.shoot()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <div className="absolute inset-0">
            <canvas
                ref={canvasRef}
                className="block h-full w-full touch-none"
                onPointerDown={() => engineRef.current?.shoot()}
            />
            {projects.length === 0 && (
                <div className="pointer-events-none absolute inset-x-0 top-1/2 text-center text-2xl text-parchment">
                    Chưa có kho báu nào ở bộ lọc này 🕳️
                </div>
            )}
        </div>
    )
}