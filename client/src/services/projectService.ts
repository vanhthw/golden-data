import { projects } from '../data'
import type { Domain, Level, Project } from '../types/project'

// Lớp trung gian: sau này có BE chỉ cần đổi bên trong thành fetch('/api/projects')
export interface ProjectFilter {
    level: Level | 'all'
    domain: Domain | 'all'
}

export function getProjects({ level, domain }: ProjectFilter): Project[] {
    return projects.filter(
        (p) => (level === 'all' || p.difficulty === level) && (domain === 'all' || p.domain === domain),
    )
}

export function getProjectById(id: string): Project | undefined {
    return projects.find((p) => p.id === id)
}

export const TOTAL_PROJECTS = projects.length