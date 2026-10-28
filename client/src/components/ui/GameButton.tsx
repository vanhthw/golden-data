import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost'
    size?: 'md' | 'lg'
    icon?: boolean
}

export default function GameButton({
    variant = 'primary',
    size = 'md',
    icon = false,
    className = '',
    ...rest
}: Props) {
    const base =
        'cursor-pointer select-none rounded-xl border-4 border-wood-dark text-wood-dark shadow-[0_5px_0_var(--color-wood-dark)] transition active:translate-y-[5px] active:shadow-none'
    const color = variant === 'primary' ? 'bg-gold hover:brightness-110' : 'bg-parchment hover:brightness-95'
    const dim = icon
        ? 'grid size-12 place-items-center text-2xl'
        : size === 'lg'
            ? 'px-10 py-4 text-3xl'
            : 'px-5 py-2 text-xl'
    return (
        <button
            type="button"
            // bỏ focus sau khi click chuột để phím Space không kích hoạt lại nút
            onPointerUp={(e) => e.currentTarget.blur()}
            className={`${base} ${color} ${dim} ${className}`}
            {...rest}
        />
    )
}