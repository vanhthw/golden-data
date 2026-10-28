import type { Project } from '../../types/project'

export const ecommerceRfm: Project = {
    id: 'ecommerce-rfm',
    title: 'Phân khúc khách hàng bằng RFM',
    domain: 'ecommerce',
    difficulty: 'easy',
    item: { type: 'gold', size: 'L' },
    tags: ['SQL', 'Excel', 'Tableau'],
    context: {
        background: 'Sàn thương mại điện tử đang gửi cùng một chiến dịch khuyến mãi cho toàn bộ khách, hiệu quả thấp và tốn ngân sách.',
        problem: 'Chia khách hàng thành các nhóm có giá trị khác nhau để thiết kế ưu đãi phù hợp từng nhóm.',
        goals: ['Tính Recency, Frequency, Monetary', 'Đặt tên và mô tả từng phân khúc', 'Đề xuất chiến dịch theo nhóm'],
    },
    steps: [
        {
            title: 'Tính RFM',
            description: 'Tính 3 chỉ số cho mỗi khách rồi chấm điểm từ 1 đến 5 theo phân vị.',
            code: {
                language: 'sql',
                snippet:
                    'SELECT customer_id,\n  DATEDIFF(CURRENT_DATE, MAX(order_date)) AS recency,\n  COUNT(*) AS frequency,\n  SUM(total) AS monetary\nFROM orders GROUP BY customer_id;',
            },
        },
        { title: 'Gom nhóm và đặt tên', description: 'Gộp tổ hợp điểm thành các nhóm như VIP, Trung thành, Sắp rời bỏ, Mới.' },
    ],
    result: {
        summary: 'Nhóm VIP chỉ chiếm 8% khách nhưng đóng góp gần một nửa doanh thu.',
        insights: ['Nhóm "Sắp rời bỏ" phản hồi tốt với voucher có thời hạn ngắn'],
        metrics: [{ label: 'Số phân khúc', value: '5' }],
    },
}