import type { ReactNode } from 'react'

export default function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h3 className="mb-1 text-xl text-wood">{title}</h3>
            <div className="text-lg leading-relaxed">{children}</div>
        </section>
    )
}