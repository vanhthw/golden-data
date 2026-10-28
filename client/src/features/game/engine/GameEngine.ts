import type { ItemSize, ItemType, Project } from '../../../types/project'

interface Item {
    id: string
    type: ItemType
    size: ItemSize
    x: number
    y: number
    r: number
    shape: number[]
    carried: boolean
}

type HookState = 'swing' | 'extend' | 'retract'

export interface EngineCallbacks {
    onCollect: (projectId: string) => void
}

// ----- Hằng số (đơn vị "thế giới ảo", không phải pixel) -----
const BASE_H = 900
const MIN_W = 700
const GROUND_RATIO = 0.2
const RADIUS: Record<ItemSize, number> = { S: 28, M: 40, L: 54 }
const WEIGHT: Record<ItemSize, number> = { S: 1, M: 1.7, L: 2.6 }
const COLORS: Record<ItemType, [string, string]> = {
    gold: ['#ffd23f', '#b8860b'],
    diamond: ['#7df3ff', '#1b8aa6'],
    stone: ['#9aa0a6', '#4a4f55'],
}
const REST_LEN = 70
const MAX_ANGLE = 1.2
const SWING_SPEED = 1.5
const EXTEND_SPEED = 700
const RETRACT_SPEED = 560
const HOOK_R = 14

function mulberry32(seed: number): () => number {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

export class GameEngine {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private readonly cb: EngineCallbacks

    private bg: HTMLCanvasElement | null = null
    private projects: Project[] = []
    private items: Item[] = []
    private visited = new Set<string>()

    private dpr = 1
    private scale = 1
    private worldW = 1600
    private worldH = 900

    private state: HookState = 'swing'
    private angle = 0
    private dir = 1
    private len = REST_LEN
    private carried: Item | null = null

    private paused = false
    private raf = 0
    private last = 0

    constructor(canvas: HTMLCanvasElement, callbacks: EngineCallbacks) {
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas 2D không khả dụng')
        this.ctx = ctx
        this.cb = callbacks
        this.resize()
    }

    // ----- API công khai -----
    start(): void {
        this.last = performance.now()
        this.raf = requestAnimationFrame(this.loop)
    }

    destroy(): void {
        cancelAnimationFrame(this.raf)
    }

    setPaused(p: boolean): void {
        this.paused = p
    }

    isPaused(): boolean {
        return this.paused
    }

    setProjects(projects: Project[]): void {
        this.projects = projects
        this.resetHook()
        this.layoutItems()
    }

    setVisited(ids: Set<string>): void {
        this.visited = ids
    }

    shoot(): void {
        if (!this.paused && this.state === 'swing') this.state = 'extend'
    }

    resize(): void {
        const w = this.canvas.clientWidth
        const h = this.canvas.clientHeight
        if (!w || !h) return
        this.dpr = Math.min(window.devicePixelRatio || 1, 2) // giới hạn DPR để đỡ nặng
        this.canvas.width = Math.round(w * this.dpr)
        this.canvas.height = Math.round(h * this.dpr)
        this.scale = Math.min(h / BASE_H, w / MIN_W)
        this.worldW = w / this.scale
        this.worldH = h / this.scale
        this.resetHook()
        this.buildBackground()
        this.layoutItems()
    }

    // ----- Nội bộ -----
    private resetHook(): void {
        this.state = 'swing'
        this.len = REST_LEN
        this.carried = null
        for (const it of this.items) it.carried = false
    }

    private get groundY(): number {
        return this.worldH * GROUND_RATIO
    }

    private tip(): { x: number; y: number } {
        const ox = this.worldW / 2
        const oy = this.groundY + 4
        return { x: ox + Math.sin(this.angle) * this.len, y: oy + Math.cos(this.angle) * this.len }
    }

    private layoutItems(): void {
        const rand = mulberry32(2024)
        const gy = this.groundY
        const sorted = [...this.projects].sort((a, b) => RADIUS[b.item.size] - RADIUS[a.item.size])
        const placed: Item[] = []

        for (const p of sorted) {
            const r = RADIUS[p.item.size]
            let x = 0
            let y = 0
            let ok = false
            for (let i = 0; i < 300 && !ok; i++) {
                x = r + 30 + rand() * Math.max(1, this.worldW - 2 * r - 60)
                y = gy + 140 + r + rand() * Math.max(1, this.worldH - gy - 140 - 2 * r - 30)
                ok = placed.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r + 24)
            }
            placed.push({
                id: p.id,
                type: p.item.type,
                size: p.item.size,
                x,
                y,
                r,
                shape: Array.from({ length: 9 }, () => 0.78 + rand() * 0.3),
                carried: false,
            })
        }
        this.items = placed
    }

    private loop = (now: number): void => {
        const dt = Math.min((now - this.last) / 1000, 0.05) // chặn nhảy cóc khi tab bị treo
        this.last = now
        if (!this.paused) this.update(dt)
        this.render(now / 1000)
        this.raf = requestAnimationFrame(this.loop)
    }

    private update(dt: number): void {
        if (this.state === 'swing') {
            this.angle += this.dir * SWING_SPEED * dt
            if (this.angle > MAX_ANGLE) {
                this.angle = MAX_ANGLE
                this.dir = -1
            } else if (this.angle < -MAX_ANGLE) {
                this.angle = -MAX_ANGLE
                this.dir = 1
            }
        } else if (this.state === 'extend') {
            this.len += EXTEND_SPEED * dt
            const t = this.tip()
            if (t.x < 0 || t.x > this.worldW || t.y > this.worldH) {
                this.state = 'retract'
                return
            }
            for (const it of this.items) {
                if (it.carried) continue
                if (Math.hypot(it.x - t.x, it.y - t.y) <= it.r + HOOK_R) {
                    it.carried = true
                    this.carried = it
                    this.state = 'retract'
                    break
                }
            }
        } else {
            const w = this.carried ? WEIGHT[this.carried.size] : 1
            this.len -= (RETRACT_SPEED / w) * dt
            if (this.len <= REST_LEN) {
                this.len = REST_LEN
                this.state = 'swing'
                const got = this.carried
                this.carried = null
                if (got) {
                    got.carried = false
                    this.cb.onCollect(got.id)
                }
            }
        }
    }

    // ----- Vẽ -----
    private render(t: number): void {
        const ctx = this.ctx
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        if (this.bg) ctx.drawImage(this.bg, 0, 0)
        ctx.setTransform(this.dpr * this.scale, 0, 0, this.dpr * this.scale, 0, 0)

        this.drawClouds(t)
        for (const it of this.items) {
            if (!it.carried) this.drawItem(it, it.x, it.y)
        }
        this.drawMiner()
        this.drawHook()
    }

    private buildBackground(): void {
        const c = document.createElement('canvas')
        c.width = this.canvas.width
        c.height = this.canvas.height
        const g = c.getContext('2d')
        if (!g) return
        g.setTransform(this.dpr * this.scale, 0, 0, this.dpr * this.scale, 0, 0)
        const gy = this.groundY

        const sky = g.createLinearGradient(0, 0, 0, gy)
        sky.addColorStop(0, '#5bb7f0')
        sky.addColorStop(1, '#bfe7ff')
        g.fillStyle = sky
        g.fillRect(0, 0, this.worldW, gy)

        const dirt = g.createLinearGradient(0, gy, 0, this.worldH)
        dirt.addColorStop(0, '#9a6330')
        dirt.addColorStop(1, '#3d2412')
        g.fillStyle = dirt
        g.fillRect(0, gy, this.worldW, this.worldH - gy)

        const rand = mulberry32(99)
        const count = Math.floor((this.worldW * this.worldH) / 9000)
        for (let i = 0; i < count; i++) {
            const s = 4 + rand() * 10
            g.fillStyle = rand() > 0.5 ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.08)'
            g.fillRect(rand() * this.worldW, gy + 20 + rand() * (this.worldH - gy - 20), s, s)
        }

        g.fillStyle = '#5aa83c'
        g.fillRect(0, gy - 10, this.worldW, 26)
        g.fillStyle = '#3f7d2a'
        g.fillRect(0, gy + 12, this.worldW, 8)
        this.bg = c
    }

    private drawClouds(t: number): void {
        const ctx = this.ctx
        const gy = this.groundY
        const span = this.worldW + 300
        ctx.fillStyle = 'rgba(255,255,255,0.92)'
        for (let i = 0; i < 3; i++) {
            const x = (((i * span) / 3 + t * (12 + i * 5)) % span) - 150
            const y = gy * (0.2 + i * 0.22)
            ctx.beginPath()
            ctx.ellipse(x, y, 60, 22, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.ellipse(x + 38, y - 10, 38, 20, 0, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    private drawMiner(): void {
        const ctx = this.ctx
        ctx.save()
        ctx.translate(this.worldW / 2, this.groundY)
        ctx.lineWidth = 4
        ctx.strokeStyle = '#3b2412'
        const box = (x: number, y: number, w: number, h: number, color: string) => {
            ctx.fillStyle = color
            ctx.fillRect(x, y, w, h)
            ctx.strokeRect(x, y, w, h)
        }
        box(-34, -24, 68, 24, '#8b5a2b') // tời
        box(-18, -78, 36, 54, '#2f6fb5') // thân
        box(-14, -108, 28, 30, '#f5c9a0') // mặt
        box(-18, -120, 36, 16, '#ffd23f') // mũ
        ctx.restore()
    }

    private drawHook(): void {
        const ctx = this.ctx
        const ox = this.worldW / 2
        const oy = this.groundY + 4
        const t = this.tip()

        ctx.strokeStyle = '#3b2412'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(t.x, t.y)
        ctx.stroke()

        if (this.carried) {
            const off = this.carried.r * 0.75 + 6
            this.drawItem(this.carried, t.x + Math.sin(this.angle) * off, t.y + Math.cos(this.angle) * off)
        }

        ctx.save()
        ctx.translate(t.x, t.y)
        ctx.rotate(-this.angle)
        ctx.strokeStyle = '#cfd4da'
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-14, 14)
        ctx.lineTo(-10, 24)
        ctx.moveTo(0, 0)
        ctx.lineTo(14, 14)
        ctx.lineTo(10, 24)
        ctx.stroke()
        ctx.fillStyle = '#8d949c'
        ctx.beginPath()
        ctx.arc(0, 0, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }

    private drawItem(it: Item, x: number, y: number): void {
        const ctx = this.ctx
        const r = it.r
        const [fill, stroke] = COLORS[it.type]
        ctx.save()
        ctx.translate(x, y)
        ctx.lineWidth = 4
        ctx.lineJoin = 'round'
        ctx.strokeStyle = stroke
        ctx.fillStyle = fill
        ctx.beginPath()
        if (it.type === 'diamond') {
            ctx.moveTo(0, -r)
            ctx.lineTo(r * 0.9, -r * 0.1)
            ctx.lineTo(0, r)
            ctx.lineTo(-r * 0.9, -r * 0.1)
        } else {
            const n = it.shape.length
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2
                const rr = r * it.shape[i]
                const px = Math.cos(a) * rr
                const py = Math.sin(a) * rr
                if (i === 0) ctx.moveTo(px, py)
                else ctx.lineTo(px, py)
            }
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = 'rgba(255,255,255,0.45)'
        ctx.beginPath()
        ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.18, r * 0.1, -0.6, 0, Math.PI * 2)
        ctx.fill()

        if (this.visited.has(it.id)) {
            const bx = r * 0.7
            const by = -r * 0.7
            ctx.fillStyle = '#3fb950'
            ctx.beginPath()
            ctx.arc(bx, by, 13, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(bx - 6, by)
            ctx.lineTo(bx - 1, by + 5)
            ctx.lineTo(bx + 7, by - 5)
            ctx.stroke()
        }
        ctx.restore()
    }
}