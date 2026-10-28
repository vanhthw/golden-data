import { z } from 'zod'

export const DOMAINS = ['banking', 'ecommerce'] as const
export const LEVELS = ['easy', 'medium', 'hard'] as const
export const ITEM_TYPES = ['gold', 'diamond', 'stone'] as const
export const ITEM_SIZES = ['S', 'M', 'L'] as const

// Mỗi project BẮT BUỘC có đủ context + steps + result. Thiếu là lỗi ngay khi chạy.
export const ProjectSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    domain: z.enum(DOMAINS),
    difficulty: z.enum(LEVELS),
    item: z.object({
        type: z.enum(ITEM_TYPES), // độ "quý" của project
        size: z.enum(ITEM_SIZES), // càng to càng nặng, kéo càng chậm
    }),
    tags: z.array(z.string()).min(1),
    context: z.object({
        background: z.string().min(20),
        problem: z.string().min(20),
        goals: z.array(z.string().min(1)).min(1),
    }),
    steps: z
        .array(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                code: z.object({ language: z.string(), snippet: z.string() }).optional(),
            }),
        )
        .min(1),
    result: z.object({
        summary: z.string().min(1),
        insights: z.array(z.string().min(1)).min(1),
        metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
        demo: z.object({ type: z.enum(['image', 'link']), url: z.string() }).optional(),
    }),
})

export type Project = z.infer<typeof ProjectSchema>
export type Domain = (typeof DOMAINS)[number]
export type Level = (typeof LEVELS)[number]
export type ItemType = (typeof ITEM_TYPES)[number]
export type ItemSize = (typeof ITEM_SIZES)[number]