import type { Domain, ItemType, Level } from '../types/project'

export const LEVEL_LABEL: Record<Level | 'all', string> = {
    all: 'Tất cả',
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
}

export const DOMAIN_LABEL: Record<Domain | 'all', string> = {
    all: 'Tất cả',
    banking: 'Ngân hàng',
    ecommerce: 'Thương mại điện tử',
}

export const ITEM_LABEL: Record<ItemType, { icon: string; name: string }> = {
    gold: { icon: '🪙', name: 'Vàng' },
    diamond: { icon: '💎', name: 'Kim cương' },
    stone: { icon: '🪨', name: 'Đá' },
}