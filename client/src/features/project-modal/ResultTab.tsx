import Section from '../../components/ui/Section'
import type { Project } from '../../types/project'

export default function ResultTab({ project }: { project: Project }) {
    const { summary, insights, metrics, demo } = project.result
    return (
        <div className="space-y-4">
            <Section title="Tóm tắt">{summary}</Section>

            {metrics && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {metrics.map((m) => (
                        <div key={m.label} className="rounded-xl border-4 border-wood-dark bg-gold p-3 text-center">
                            <div className="text-3xl">{m.value}</div>
                            <div className="text-base">{m.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <Section title="Insight chính">
                <ul className="list-disc space-y-1 pl-6">
                    {insights.map((i) => (
                        <li key={i}>{i}</li>
                    ))}
                </ul>
            </Section>

            <Section title="Demo">
                {!demo && <p className="opacity-70">Demo sẽ được bổ sung sau 🚧</p>}
                {demo?.type === 'image' && (
                    <img src={demo.url} alt="Demo" loading="lazy" className="w-full rounded-lg border-4 border-wood-dark" />
                )}
                {demo?.type === 'link' && (
                    <a href={demo.url} target="_blank" rel="noreferrer" className="underline">
                        Mở demo ↗
                    </a>
                )}
            </Section>
        </div>
    )
}