import type { Project } from '../../types/project'

export const bankingChurn: Project = {
    id: 'banking-churn',
    title: 'Dự đoán khách hàng rời bỏ thẻ tín dụng',
    domain: 'banking',
    difficulty: 'medium',
    item: { type: 'gold', size: 'M' },
    tags: ['SQL', 'Python', 'Power BI'],
    context: {
        background:
            'Ngân hàng bán lẻ nhận thấy số khách đóng thẻ tín dụng tăng liên tục trong 2 quý gần nhất, trong khi chi phí thu hút khách mới ngày càng đắt.',
        problem:
            'Xác định nhóm khách hàng có nguy cơ rời bỏ cao và các yếu tố chính dẫn đến việc rời bỏ để bộ phận CRM can thiệp sớm.',
        goals: ['Mô tả hành vi nhóm khách rời bỏ', 'Xây điểm rủi ro churn', 'Đề xuất hành động giữ chân'],
    },
    steps: [
        {
            title: 'Làm sạch và gộp dữ liệu',
            description: 'Gộp bảng khách hàng, giao dịch và khiếu nại; xử lý giá trị thiếu và ngoại lai.',
            code: {
                language: 'sql',
                snippet:
                    'SELECT c.customer_id, COUNT(t.id) AS txn_90d, SUM(t.amount) AS spend_90d\nFROM customers c\nLEFT JOIN transactions t ON t.customer_id = c.customer_id\n  AND t.txn_date >= CURRENT_DATE - INTERVAL 90 DAY\nGROUP BY c.customer_id;',
            },
        },
        { title: 'Phân tích khám phá (EDA)', description: 'So sánh tần suất giao dịch, hạn mức sử dụng và số lần khiếu nại giữa 2 nhóm.' },
        { title: 'Xây điểm rủi ro', description: 'Dùng hồi quy logistic, đánh giá bằng AUC và chia khách thành 3 nhóm rủi ro.' },
    ],
    result: {
        summary: 'Nhóm rủi ro cao chiếm 12% khách nhưng giải thích phần lớn lượng đóng thẻ.',
        insights: ['Giao dịch giảm liên tiếp 2 tháng là tín hiệu mạnh nhất', 'Khách có khiếu nại chưa xử lý xong rời bỏ cao gấp 3 lần'],
        metrics: [
            { label: 'AUC', value: '0.82' },
            { label: 'Nhóm rủi ro cao', value: '12%' },
        ],
    },
}