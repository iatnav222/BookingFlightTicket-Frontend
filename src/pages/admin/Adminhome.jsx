import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, FaCoins, FaShoppingCart, FaPlaneDeparture, FaUsers,
  FaLongArrowAltRight, FaCheckCircle, FaTimesCircle, FaClock
} from 'react-icons/fa';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// IMPORT API (Kiểm tra lại đường dẫn import cho đúng với project của bạn)
import { orderApi } from '../../services/orderApi';
import { chuyenBayApi } from '../../services/chuyenBayApi';
import { taiKhoanApi } from '../../services/taiKhoanApi';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
);

const Adminhome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State lưu trữ dữ liệu thống kê
  const [stats, setStats] = useState({ 
    doanhThu: 0, 
    tongDonHang: 0, 
    chuyenBaySapToi: 0, 
    khachHang: 0 
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  
  // State biểu đồ
  const [chartData, setChartData] = useState({
    lineLabels: [],
    lineData: [],
    pieData: [0, 0, 0] // Thành công, Chờ xử lý, Đã hủy
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Gọi song song 3 API để lấy dữ liệu (Lấy số lượng lớn để tính thống kê)
        const [resOrders, resFlights, resAccounts] = await Promise.all([
          orderApi.getDanhSach({ per_page: 2000 }),
          chuyenBayApi.getDanhSach({ per_page: 2000 }),
          taiKhoanApi.getDanhSach({ per_page: 2000 })
        ]);

        const orders = resOrders.data?.data || resOrders.data || [];
        const flights = resFlights.data?.data || resFlights.data || [];
        const accounts = resAccounts.data?.data || resAccounts.data || [];

        // 1. TÍNH TOÁN ĐƠN HÀNG & DOANH THU
        let totalRev = 0;
        let countSuccess = 0;
        let countPending = 0;
        let countCancel = 0;

        // Khởi tạo mảng doanh thu 6 tháng gần nhất
        const last6Months = [];
        const monthData = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          last6Months.push(`T${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`);
          monthData.push({ month: d.getMonth(), year: d.getFullYear(), total: 0 });
        }

        orders.forEach(o => {
          const status = Number(o.trangThai);
          const amount = Number(o.tongTien) || 0;
          const orderDate = new Date(o.ngayDat);

          if (status === 1) {
            totalRev += amount;
            countSuccess++;
            // Cộng tiền vào tháng tương ứng trên biểu đồ
            const monthObj = monthData.find(m => m.month === orderDate.getMonth() && m.year === orderDate.getFullYear());
            if (monthObj) monthObj.total += amount;
          } else if (status === 2) {
            countCancel++;
          } else {
            countPending++;
          }
        });

        // Lấy 5 giao dịch gần nhất
        const recent = [...orders]
          .sort((a, b) => new Date(b.ngayDat) - new Date(a.ngayDat))
          .slice(0, 5)
          .map(o => ({
            id: o.maCodeDonHang || o.maDonHang,
            khach: o.thongTinLienHe?.ten || o.taikhoan?.hoten || 'Khách vãng lai',
            tien: o.tongTien,
            trangThai: Number(o.trangThai),
            rawId: o.maDonHang // Dùng để navigate
          }));

        // 2. TÍNH TOÁN CHUYẾN BAY SẮP TỚI
        const now = new Date();
        const upcomingFlights = flights.filter(f => new Date(f.ngayGioCatCanh) > now).length;

        // Tạo Top chặng bay (Lấy tạm dữ liệu từ chuyến bay để demo chặng phổ biến)
        const routesMap = {};
        flights.forEach(f => {
            const key = `${f.san_bay_di?.thanhPho}-${f.san_bay_den?.thanhPho}`;
            if (!routesMap[key]) {
                routesMap[key] = {
                    id: f.maChuyenBay,
                    di: f.san_bay_di?.thanhPho || f.maSanBayDi,
                    den: f.san_bay_den?.thanhPho || f.maSanBayDen,
                    hang: f.hang_hang_khong?.tenHang || 'N/A',
                    count: 0
                };
            }
            routesMap[key].count += 1; // Giả lập đếm số chuyến bay làm độ phổ biến
        });
        const topR = Object.values(routesMap).sort((a,b) => b.count - a.count).slice(0, 5);

        // 3. TÍNH TOÁN KHÁCH HÀNG (Tài khoản User)
        const customers = accounts.filter(a => a.quyen === 'user').length;

        // --- CẬP NHẬT STATE TỔNG ---
        setStats({
          doanhThu: totalRev,
          tongDonHang: orders.length,
          chuyenBaySapToi: upcomingFlights,
          khachHang: customers
        });
        setRecentTransactions(recent);
        setTopRoutes(topR);
        setChartData({
          lineLabels: last6Months,
          lineData: monthData.map(m => m.total),
          pieData: [countSuccess, countPending, countCancel]
        });

      } catch (error) {
        console.error("Lỗi lấy dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderStatusIcon = (status) => {
    switch(status) {
      case 1: return <FaCheckCircle className="text-[#1cc88a] text-lg" title="Thành công" />;
      case 2: return <FaTimesCircle className="text-gray-500 text-lg" title="Đã hủy" />;
      default: return <FaClock className="text-[#f6c23e] text-lg" title="Chờ xử lý" />;
    }
  };

  // Cấu hình Biểu đồ Đường
  const lineChartData = useMemo(() => ({
    labels: chartData.lineLabels,
    datasets: [
      {
        label: 'Doanh thu',
        data: chartData.lineData,
        borderColor: '#4e73df', 
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#4e73df',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4e73df',
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
        ticks: { maxTicksLimit: 6, callback: (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ' },
        grid: { color: 'rgb(234, 236, 244)', drawBorder: false, borderDash: [2] }
      },
      x: { 
        grid: { display: false, drawBorder: false },
      }
    },
    plugins: { legend: { display: false } }
  };

  // Cấu hình Biểu đồ Tròn
  const doughnutChartData = useMemo(() => ({
    labels: ['Thành công', 'Chờ xử lý', 'Đã hủy'],
    datasets: [
      {
        data: chartData.pieData,
        backgroundColor: ['#1cc88a', '#f6c23e', '#858796'],
        hoverBackgroundColor: ['#17a673', '#dda20a', '#60616f'],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  }), [chartData]);

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', 
    plugins: { legend: { display: false } }
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-gray-500">Đang tải dữ liệu tổng quan hệ thống...</div>;
  }

  return (
    <div className="font-sans text-gray-800 antialiased">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <h2 className="text-[1.75rem] font-bold text-[#4e73df] m-0">Tổng quan hệ thống</h2>
        <span className="flex items-center gap-1 text-gray-500 text-sm">
          <FaCalendarAlt className="mr-1" /> {new Date().toLocaleDateString('vi-VN')}
        </span>
      </div>

      {/* KPI Cards (CÓ THỂ CLICK ĐỂ CHUYỂN TRANG) */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        
        {/* Doanh Thu -> Chuyển sang Quản lý Doanh thu */}
        <div onClick={() => navigate('/admin/doanh-thu')} className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#1cc88a] py-2 transition-transform hover:-translate-y-1 cursor-pointer hover:shadow-[0_0.5rem_2rem_0_rgba(58,59,69,0.25)]">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#1cc88a] uppercase mb-1">Doanh Thu (Thực)</div>
                <div className="text-xl font-bold text-[#5a5c69]">
                  {stats.doanhThu.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="shrink-0"><FaCoins className="text-[2rem] text-gray-300 opacity-100" /></div>
            </div>
          </div>
        </div>

        {/* Tổng Đơn Hàng -> Chuyển sang Quản lý Đơn hàng */}
        <div onClick={() => navigate('/admin/don-hang')} className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#4e73df] py-2 transition-transform hover:-translate-y-1 cursor-pointer hover:shadow-[0_0.5rem_2rem_0_rgba(58,59,69,0.25)]">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#4e73df] uppercase mb-1">Tổng Đơn Hàng</div>
                <div className="text-xl font-bold text-[#5a5c69]">{stats.tongDonHang}</div>
              </div>
              <div className="shrink-0"><FaShoppingCart className="text-[2rem] text-gray-300 opacity-100" /></div>
            </div>
          </div>
        </div>

        {/* Chuyến Bay Sắp Tới -> Chuyển sang Quản lý Chuyến bay */}
        <div onClick={() => navigate('/admin/chuyen-bay')} className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#36b9cc] py-2 transition-transform hover:-translate-y-1 cursor-pointer hover:shadow-[0_0.5rem_2rem_0_rgba(58,59,69,0.25)]">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#36b9cc] uppercase mb-1">Chuyến Bay Sắp Tới</div>
                <div className="text-xl font-bold text-[#5a5c69]">{stats.chuyenBaySapToi}</div>
              </div>
              <div className="shrink-0"><FaPlaneDeparture className="text-[2rem] text-gray-300 opacity-100" /></div>
            </div>
          </div>
        </div>

        {/* Khách Hàng -> Chuyển sang Quản lý Tài khoản */}
        <div onClick={() => navigate('/admin/tai-khoan')} className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#f6c23e] py-2 transition-transform hover:-translate-y-1 cursor-pointer hover:shadow-[0_0.5rem_2rem_0_rgba(58,59,69,0.25)]">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#f6c23e] uppercase mb-1">Khách Hàng</div>
                <div className="text-xl font-bold text-[#5a5c69]">{stats.khachHang}</div>
              </div>
              <div className="shrink-0"><FaUsers className="text-[2rem] text-gray-300 opacity-100" /></div>
            </div>
          </div>
        </div>

      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] lg:col-span-2 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Biểu Đồ Doanh Thu (6 Tháng Qua)</h6>
          </div>
          <div className="p-4 flex-1">
            <div className="h-[320px] w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Tỷ Lệ Trạng Thái Đơn Hàng</h6>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="h-[250px] w-full flex justify-center pt-4 pb-2">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
            <div className="mt-4 text-center text-sm text-[#858796]">
               <span className="mr-3"><i className="fas fa-circle text-[#1cc88a] text-xs mr-1"></i> Thành công</span>
               <span className="mr-3"><i className="fas fa-circle text-[#f6c23e] text-xs mr-1"></i> Chờ xử lý</span>
               <span><i className="fas fa-circle text-gray-500 text-xs mr-1"></i> Đã hủy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Bảng Top Chặng Bay */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
          <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Top Chặng Bay Phổ Biến</h6>
          </div>
          <div className="p-4">
            {topRoutes.length === 0 ? (
                <p className="text-center text-gray-500 py-3">Chưa có dữ liệu chuyến bay.</p>
            ) : (
                topRoutes.map((route, index) => (
                <React.Fragment key={route.id}>
                    <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition" onClick={() => navigate(`/admin/chuyen-bay/sua/${route.id}`)}>
                    <div>
                        <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">{route.di}</span>
                        <FaLongArrowAltRight className="text-gray-400 text-xs mx-1" />
                        <span className="font-bold text-[#4e73df] text-sm">{route.den}</span>
                        </div>
                        <div className="text-[13px] text-gray-500 mt-0.5">{route.hang}</div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-[#e74a3b] rounded-full">{route.count} chuyến</span>
                    </div>
                    {index !== topRoutes.length - 1 && <hr className="my-2 border-gray-200 opacity-100" />}
                </React.Fragment>
                ))
            )}
          </div>
        </div>

        {/* Bảng Giao dịch gần đây */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Giao Dịch Gần Đây</h6>
            <Link to="/admin/don-hang" className="px-2 py-1 text-xs font-medium text-[#4e73df] border border-[#4e73df] rounded hover:bg-blue-50 transition-colors">
              Xem tất cả
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left align-middle">
              <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-sm font-semibold">Mã Đơn</th>
                  <th className="px-4 py-2.5 text-sm font-semibold">Khách Hàng</th>
                  <th className="px-4 py-2.5 text-sm font-semibold">Tiền (VND)</th>
                  <th className="px-4 py-2.5 text-sm font-semibold text-center">TT</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-gray-500">Chưa có giao dịch.</td></tr>
                ) : (
                    recentTransactions.map((tx) => (
                    // Click vào dòng sẽ dẫn tới chi tiết đơn hàng
                    <tr key={tx.id} onClick={() => navigate(`/admin/don-hang/${tx.rawId}`)} className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-[13px] font-bold text-[#4e73df]">#{tx.id}</td>
                        <td className="px-4 py-3 text-[13px] text-gray-700">{tx.khach}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-[#e74a3b]">{new Intl.NumberFormat('vi-VN').format(tx.tien)}</td>
                        <td className="px-4 py-3 text-center">
                        {renderStatusIcon(tx.trangThai)}
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Adminhome;