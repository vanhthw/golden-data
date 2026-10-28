import type { Project } from '../../types/project'

export const bankingFraud: Project = {
    id: 'banking-fraud',
    title: 'Phát hiện giao dịch gian lận',
    domain: 'banking',
    difficulty: 'hard',
    item: { type: 'diamond', size: 'S' },
    tags: ['Python', 'Anomaly Detection'],
    context: {
        background: 'Tỷ lệ giao dịch gian lận rất thấp nhưng mỗi vụ gây thiệt hại lớn, quy tắc thủ công bỏ sót nhiều trường hợp.',
        problem: 'Xây cơ chế chấm điểm bất thường cho từng giao dịch để ưu tiên danh sách cần kiểm tra thủ công.',
        goals: ['Xử lý dữ liệu mất cân bằng', 'Tối ưu precision/recall', 'Giảm số cảnh báo giả'],
    },
    steps: [
        { title: 'Tạo đặc trưng hành vi', description: 'Tần suất, khoảng cách địa lý và lệch so với thói quen chi tiêu của từng khách.' },
        { title: 'Huấn luyện mô hình', description: 'So sánh Isolation Forest và Gradient Boosting, dùng cross-validation theo thời gian.' },
    ],
    result: {
        summary: 'Mô hình bắt được phần lớn gian lận với số cảnh báo giả chấp nhận được.',
        insights: ['Giao dịch đêm khuya ở ngoài khu vực thường xuyên rủi ro cao hơn hẳn'],
        metrics: [{ label: 'Recall', value: '78%' }],
    },
}