import type { Project } from '../../types/project'

export default function StepsTab({ project }: { project: Project }) {
    return (
        <ol className="space-y-4">
            {project.steps.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border-4 border-wood-dark bg-gold text-lg">
                        {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-xl">{s.title}</h4>
                        <p className="text-lg leading-relaxed">{s.description}</p>
                        {s.code && (
                            <pre className="mt-2 overflow-x-auto rounded-lg bg-wood-dark p-3 font-mono text-sm text-parchment">
                                <code>{s.code.snippet}</code>
                            </pre>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    )
}