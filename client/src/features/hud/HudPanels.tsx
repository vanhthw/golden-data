import { AnimatePresence } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import GameButton from '../../components/ui/GameButton'
import { useGameStore } from '../../store/useGameStore'
import { DOMAIN_LABEL, LEVEL_LABEL } from '../../constants/labels'
import { DOMAINS, LEVELS, type Domain, type Level } from '../../types/project'

const LEVEL_KEYS: (Level | 'all')[] = ['all', ...LEVELS]
const DOMAIN_KEYS: (Domain | 'all')[] = ['all', ...DOMAINS]

function ChoiceList<T extends string>({
    options,
    value,
    labels,
    onPick,
}: {
    options: readonly T[]
    value: T
    labels: Record<T, string>
    onPick: (v: T) => void
}) {
    return (
        <div className="grid gap-3">
            {options.map((o) => (
                <GameButton key={o} variant={o === value ? 'primary' : 'ghost'} onClick={() => onPick(o)}>
                    {labels[o]}
                    {o === value ? ' ✓' : ''}
                </GameButton>
            ))}
        </div>
    )
}

function SettingsBody() {
    const soundOn = useGameStore((s) => s.soundOn)
    const toggleSound = useGameStore((s) => s.toggleSound)
    const resetProgress = useGameStore((s) => s.resetProgress)
    return (
        <div className="grid gap-3">
            <GameButton onClick={toggleSound}>{soundOn ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt'}</GameButton>
            <GameButton variant="ghost" onClick={resetProgress}>
                🔄 Xóa tiến độ đã khám phá
            </GameButton>
        </div>
    )
}

function LevelBody() {
    const level = useGameStore((s) => s.level)
    const setLevel = useGameStore((s) => s.setLevel)
    const setPanel = useGameStore((s) => s.setPanel)
    return (
        <ChoiceList
            options={LEVEL_KEYS}
            value={level}
            labels={LEVEL_LABEL}
            onPick={(v) => {
                setLevel(v)
                setPanel(null)
            }}
        />
    )
}

function DomainBody() {
    const domain = useGameStore((s) => s.domain)
    const setDomain = useGameStore((s) => s.setDomain)
    const setPanel = useGameStore((s) => s.setPanel)
    return (
        <ChoiceList
            options={DOMAIN_KEYS}
            value={domain}
            labels={DOMAIN_LABEL}
            onPick={(v) => {
                setDomain(v)
                setPanel(null)
            }}
        />
    )
}

export default function HudPanels() {
    const panel = useGameStore((s) => s.panel)
    const setPanel = useGameStore((s) => s.setPanel)
    const close = () => setPanel(null)

    return (
        <AnimatePresence>
            {panel === 'settings' && (
                <Modal key="settings" title="⚙️ Cài đặt" onClose={close}>
                    <SettingsBody />
                </Modal>
            )}
            {panel === 'level' && (
                <Modal key="level" title="🏆 Độ khó" onClose={close}>
                    <LevelBody />
                </Modal>
            )}
            {panel === 'domain' && (
                <Modal key="domain" title="🗂️ Lĩnh vực" onClose={close}>
                    <DomainBody />
                </Modal>
            )}
        </AnimatePresence>
    )
}