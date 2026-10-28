import Section from '../../components/ui/Section'
import { DOMAIN_LABEL, LEVEL_LABEL } from '../../constants/labels'
import type { Project } from '../../types/project'

export default function ContextTab({ project }: { project: Project }) {
    const { context, tags, domain, difficulty } = project
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-base">
                <span className="rounded-full border-2 border-wood-dark bg-gold px-3">{DOMAIN_LABEL[domain]}</span>
                <span className="rounded-full border-2 border-wood-dark bg-wood px-3">{LEVEL_LABEL[difficulty]}</span>
                {tags.map((t) => (
                    <span key={t} className="rounded-full border-2 border-wood-dark bg-white px-3">
                        {t}
                    </span>
                ))}
            </div>
            <Section title="Bối cảnh">{context.background}</Section>
            <Section title="Bài toán cần giải quyết">{context.problem}</Section>
            <Section title="Mục tiêu">
                <ul className="list-disc space-y-1 pl-6">
                    {context.goals.map((g) => (
                        <li key={g}>{g}</li>
                    ))}
                </ul>
            </Section>
        </div>
    )
}