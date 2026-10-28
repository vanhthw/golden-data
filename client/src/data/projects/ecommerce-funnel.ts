import type { Project } from '../../types/project'

export const ecommerceFunnel: Project = {
    id: 'ecommerce-funnel',
    title: 'Phân tích phễu chuyển đổi mua hàng',
    domain: 'ecommerce',
    difficulty: 'medium',
    item: { type: 'stone', size: 'M' },
    tags: ['SQL', 'GA4', 'Looker Studio'],
    context: {
        background: 'Lưu lượng truy cập tăng nhưng doanh thu gần như đi ngang, nhiều khách thêm vào giỏ rồi bỏ đi.',
        problem: 'Tìm bước nào trong phễu từ xem sản phẩm đến thanh toán đang mất khách nhiều nhất và vì sao.',
        goals: ['Dựng phễu theo từng bước', 'So sánh theo thiết bị và nguồn truy cập', 'Đề xuất thử nghiệm A/B'],
    },
    steps: [
        { title: 'Định nghĩa các bước phễu', description: 'Xem sản phẩm, thêm giỏ, bắt đầu thanh toán, hoàn tất đơn.' },
        { title: 'Phân tách theo phân khúc', description: 'So sánh tỷ lệ rơi rụng giữa mobile/desktop và giữa các kênh.' },
    ],
    result: {
        summary: 'Điểm rơi rụng lớn nhất nằm ở bước thanh toán trên mobile.',
        insights: ['Bắt buộc tạo tài khoản làm tăng tỷ lệ bỏ giỏ rõ rệt'],
        metrics: [{ label: 'Rơi rụng ở bước thanh toán', value: '41%' }],
    },
}