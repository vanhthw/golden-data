import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import GameButton from './GameButton'

interface Props {
    title: string
    onClose: () => void
    children: ReactNode
    wide?: boolean
}

export default function Modal({ title, onClose, children, wide = false }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                className={`flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl border-4 border-wood-dark bg-parchment text-wood-dark shadow-[0_8px_0_var(--color-wood-dark)] ${wide ? 'max-w-3xl' : 'max-w-md'
                    }`}
                initial={{ scale: 0.85, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between gap-3 border-b-4 border-wood-dark bg-wood px-4 py-3">
                    <h2 className="text-2xl">{title}</h2>
                    <GameButton icon variant="ghost" onClick={onClose} aria-label="Đóng">
                        ✕
                    </GameButton>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
            </motion.div>
        </motion.div>
    )
}