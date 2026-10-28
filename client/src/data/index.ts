import { z } from 'zod'
import { ProjectSchema, type Project } from '../types/project'
import { bankingChurn } from './projects/banking-churn'
import { bankingFraud } from './projects/banking-fraud'
import { ecommerceRfm } from './projects/ecommerce-rfm'
import { ecommerceFunnel } from './projects/ecommerce-funnel'

const raw = [bankingChurn, bankingFraud, ecommerceRfm, ecommerceFunnel]

// Thiếu trường bắt buộc là throw lỗi ngay lúc app khởi động
export const projects: Project[] = z.array(ProjectSchema).parse(raw)

const ids = new Set(projects.map((p) => p.id))
if (ids.size !== projects.length) {
    throw new Error('Có project bị trùng id')
}