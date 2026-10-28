import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import GameButton from '../../components/ui/GameButton'
import { useGameStore } from '../../store/useGameStore'
import { getProjectById } from '../../services/projectService'
import { ITEM_LABEL } from '../../constants/labels'
import type { Project } from '../../types/project'
import ContextTab from './ContextTab'
import StepsTab from './StepsTab'
import ResultTab from './ResultTab'

const TABS = [
    { key: 'context', label: '📜 Bối cảnh' },
    { key: 'steps', label: '🛠️ Từng bước' },
    { key: 'result', label: '🏆 Kết quả' },
] as const

type TabKey = (typeof TABS)[number]['key']

function Content({ project, onClose }: { project: Project; onClose: () => void }) {
    const [tab, setTab] = useState<TabKey>('context')
    const item = ITEM_LABEL[project.item.type]

    return (
        <Modal wide title={`${item.icon} ${project.title}`} onClose={onClose}>
            <div className="mb-4 grid grid-cols-3 gap-2">
                {TABS.map((t) => (
                    <GameButton
                        key={t.key}
                        variant={tab === t.key ? 'primary' : 'ghost'}
                        className="!px-2 text-base sm:text-xl"
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </GameButton>
                ))}
            </div>
            {tab === 'context' && <ContextTab project={project} />}
            {tab === 'steps' && <StepsTab project={project} />}
            {tab === 'result' && <ResultTab project={project} />}
        </Modal>
    )
}

export default function ProjectModal() {
    const id = useGameStore((s) => s.activeProjectId)
    const close = useGameStore((s) => s.closeProject)
    const project = id ? getProjectById(id) : undefined

    return (
        <AnimatePresence>
            {project && <Content key={project.id} project={project} onClose={close} />}
        </AnimatePresence>
    )
}