import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaDollarSign, FaCalendarAlt, FaSun, FaReceipt, 
  FaDownload, FaFileExcel, FaTimes, FaInfoCircle 
} from 'react-icons/fa';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Import API (Thay đổi đường dẫn nếu thư mục của bạn khác)
import { orderApi } from '../../../services/orderApi';

// Đăng ký các module cho Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
);

// BƯỚC SỬA LỖI: Đưa mảng màu ra ngoài Component vì chúng là hằng số tĩnh
const pieColors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
const pieHoverColors = ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617', '#60616f'];

const DoanhThu = () => {
  const [loading, setLoading] = useState(true);
  
  // State quản lý Modal Xuất Báo Cáo
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // State lưu trữ dữ liệu tính toán được
  const [stats, setStats] = useState({
    tongDoanhThu: 0,
    doanhThuThangNay: 0,
    doanhThuHomNay: 0,
    soGiaoDich: 0
  });

  const [donHangThanhCong, setDonHangThanhCong] = useState([]);
  
  // State cho biểu đồ
  const [chartData, setChartData] = useState({
    lineLabels: [],
    lineDataPoints: [],
    pieLabels: [],
    pieDataPoints: []
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách đơn hàng (giả sử truyền per_page lớn để tính toán thống kê, hoặc nếu BE không phân trang)
        const res = await orderApi.getDanhSach({ per_page: 2000 });
        const orders = res.data?.data || res.data || [];

        // Chỉ lấy các đơn hàng thanh toán thành công (Giả sử trangThai === 1 là thành công)
        const successfulOrders = orders.filter(o => o.trangThai === 1 || o.trangThai === '1');

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const todayString = today.toISOString().split('T')[0];

        let tDoanhThu = 0;
        let tThangNay = 0;
        let tHomNay = 0;

        // Xử lý dữ liệu cho biểu đồ Line (7 ngày qua)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const label = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            last7Days.push({ dateStr, label, total: 0 });
        }

        // Xử lý dữ liệu cho biểu đồ Pie (Phương thức TT)
        const paymentCounts = {};

        // Vòng lặp tính toán
        successfulOrders.forEach(order => {
           const orderDate = new Date(order.ngayDat);
           const orderDateStr = orderDate.toISOString().split('T')[0];
           const amount = Number(order.tongTien) || 0;

           // Cộng dồn doanh thu tổng
           tDoanhThu += amount;

           // Cộng dồn tháng này
           if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
               tThangNay += amount;
           }

           // Cộng dồn hôm nay
           if (orderDateStr === todayString) {
               tHomNay += amount;
           }

           // Gom dữ liệu 7 ngày cho biểu đồ
           const dayObj = last7Days.find(d => d.dateStr === orderDateStr);
           if (dayObj) {
               dayObj.total += amount;
           }

           // Gom dữ liệu phương thức thanh toán
           const method = order.phuongThucThanhToan || 'Khác';
           paymentCounts[method] = (paymentCounts[method] || 0) + 1;
        });

        // Cập nhật State Thống kê
        setStats({
            tongDoanhThu: tDoanhThu,
            doanhThuThangNay: tThangNay,
            doanhThuHomNay: tHomNay,
            soGiaoDich: successfulOrders.length
        });

        // Cập nhật State Biểu đồ
        setChartData({
            lineLabels: last7Days.map(d => d.label),
            lineDataPoints: last7Days.map(d => d.total),
            pieLabels: Object.keys(paymentCounts),
            pieDataPoints: Object.values(paymentCounts)
        });

        // Lấy top 10 giao dịch gần nhất
        const recent = successfulOrders
             .sort((a, b) => new Date(b.ngayDat) - new Date(a.ngayDat))
             .slice(0, 10)
             .map(o => ({
                 id: o.maCodeDonHang,
                 khach: o.thongTinLienHe?.ten || o.taikhoan?.hoten || 'Khách vãng lai',
                 ngayDat: o.ngayDat,
                 tongTien: o.tongTien,
                 phuongThuc: o.phuongThucThanhToan || 'N/A'
             }));
        setDonHangThanhCong(recent);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu doanh thu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // --- CẤU HÌNH BIỂU ĐỒ ĐƯỜNG (Doanh thu 7 ngày) ---
  const lineChartData = useMemo(() => ({
    labels: chartData.lineLabels,
    datasets: [
      {
        label: 'Doanh thu',
        data: chartData.lineDataPoints,
        borderColor: '#1cc88a', 
        backgroundColor: 'rgba(28, 200, 138, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#1cc88a',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1cc88a',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3, 
      },
    ],
  }), [chartData]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ' },
        grid: { color: 'rgb(234, 236, 244)', drawBorder: false, borderDash: [2] }
      },
      x: { 
        grid: { display: false, drawBorder: false }
      }
    },
    plugins: { legend: { display: false } }
  };

  // --- CẤU HÌNH BIỂU ĐỒ TRÒN (Kênh thanh toán) ---
  const doughnutChartData = useMemo(() => ({
    labels: chartData.pieLabels.length > 0 ? chartData.pieLabels : ['Chưa có DL'],
    datasets: [
      {
        data: chartData.pieDataPoints.length > 0 ? chartData.pieDataPoints : [1],
        backgroundColor: pieColors.slice(0, chartData.pieLabels.length || 1),
        hoverBackgroundColor: pieHoverColors.slice(0, chartData.pieLabels.length || 1),
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  }), [chartData]);

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', 
    plugins: { legend: { position: 'bottom' } }
  };

  const handleExport = (e) => {
    e.preventDefault();
    // Chèn logic gọi API xuất Excel ở đây, ví dụ: 
    // orderApi.exportExcel({ start: exportData.startDate, end: exportData.endDate })
    console.log("Xuất báo cáo từ", exportData.startDate, "đến", exportData.endDate);
    alert("Tính năng xuất báo cáo đang được gọi!");
    setShowExportModal(false);
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-bold">Đang tải và tính toán dữ liệu doanh thu...</div>;
  }

  return (
    <div className="container-fluid px-4 mt-4 font-sans text-gray-800 antialiased pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <div>
          <h2 className="text-[1.75rem] font-bold text-[#4e73df] m-0">Báo Cáo Tài Chính</h2>
          <p className="text-sm text-gray-500 mt-1 mb-0">Quản lý doanh thu và phân tích dòng tiền</p>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="bg-[#1cc88a] text-white px-4 py-2 rounded shadow-sm hover:bg-[#17a673] transition flex items-center text-sm font-bold"
        >
          <FaDownload className="mr-2" /> Xuất Báo Cáo
        </button>
      </div>

      {/* KPI Cards (4 Cột) */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#1cc88a] py-2">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-[#1cc88a] uppercase mb-1">Tổng Doanh Thu</div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.tongDoanhThu.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <FaDollarSign className="text-[2rem] text-gray-300 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#36b9cc] py-2">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-[#36b9cc] uppercase mb-1">Tháng Này (T{new Date().getMonth() + 1})</div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.doanhThuThangNay.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <FaCalendarAlt className="text-[2rem] text-gray-300 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#f6c23e] py-2">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-[#f6c23e] uppercase mb-1">Hôm Nay</div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.doanhThuHomNay.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <FaSun className="text-[2rem] text-gray-300 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#4e73df] py-2">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-[#4e73df] uppercase mb-1">Giao Dịch Thành Công</div>
                <div className="text-xl font-bold text-gray-800">{stats.soGiaoDich} đơn</div>
              </div>
              <FaReceipt className="text-[2rem] text-gray-300 opacity-50" />
            </div>
          </div>
        </div>

      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Xu Hướng Doanh Thu (7 Ngày Gần Nhất)</h6>
          </div>
          <div className="p-4 flex-1">
            <div className="h-[300px] w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Tỷ Lệ Kênh Thanh Toán</h6>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center">
            <div className="h-[250px] w-full pt-4 pb-2">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Lịch Sử Giao Dịch Gần Nhất (Thành Công)</h6>
        </div>
        <div className="p-0 overflow-x-auto">
            <table className="w-full text-left align-middle">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 text-sm">
                    <tr>
                        <th className="px-4 py-3 font-semibold w-[15%]">Mã Đơn</th>
                        <th className="px-4 py-3 font-semibold w-[25%]">Khách Hàng</th>
                        <th className="px-4 py-3 font-semibold w-[20%]">Ngày Đặt</th>
                        <th className="px-4 py-3 font-semibold w-[15%]">Số Tiền</th>
                        <th className="px-4 py-3 font-semibold w-[10%]">Cổng TT</th>
                        <th className="px-4 py-3 font-semibold w-[15%] text-center">Trạng Thái</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                    {donHangThanhCong.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-6">Chưa có giao dịch thành công nào</td></tr>
                    ) : (
                        donHangThanhCong.map((dh) => (
                            <tr key={dh.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-bold text-[#4e73df]">#{dh.id}</td>
                                <td className="px-4 py-3">{dh.khach}</td>
                                <td className="px-4 py-3 text-gray-500">{new Date(dh.ngayDat).toLocaleString('vi-VN')}</td>
                                <td className="px-4 py-3 font-bold text-[#e74a3b]">{dh.tongTien.toLocaleString('vi-VN')} đ</td>
                                <td className="px-4 py-3">
                                    <span className="bg-[#17a2b8] text-white px-2 py-1 rounded text-xs font-bold">{dh.phuongThuc}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="bg-[#1cc88a] text-white px-3 py-1 rounded-full text-xs font-bold">Thành công</span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- MODAL XUẤT BÁO CÁO --- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-[450px] max-w-[95%] overflow-hidden animate-fade-in-up">
                <div className="bg-[#1cc88a] text-white px-4 py-3 flex justify-between items-center">
                    <h5 className="font-bold m-0 flex items-center">Xuất Báo Cáo Doanh Thu</h5>
                    <button onClick={() => setShowExportModal(false)} className="text-white hover:text-gray-200"><FaTimes /></button>
                </div>
                <form onSubmit={handleExport}>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Từ ngày:</label>
                            <input 
                                type="date" 
                                className="w-full border rounded p-2 outline-none focus:border-[#1cc88a]" 
                                value={exportData.startDate}
                                onChange={(e) => setExportData({...exportData, startDate: e.target.value})}
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Đến ngày:</label>
                            <input 
                                type="date" 
                                className="w-full border rounded p-2 outline-none focus:border-[#1cc88a]" 
                                value={exportData.endDate}
                                onChange={(e) => setExportData({...exportData, endDate: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm flex items-start mt-2">
                            <FaInfoCircle className="mt-0.5 mr-2 shrink-0" />
                            <p className="m-0">File Excel sẽ bao gồm danh sách chi tiết các đơn hàng đã thanh toán trong khoảng thời gian này.</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 border-t">
                        <button type="button" onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-bold transition">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-[#1cc88a] text-white rounded hover:bg-[#17a673] text-sm font-bold flex items-center transition">
                            <FaFileExcel className="mr-2" /> Tải Xuống
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default DoanhThu;