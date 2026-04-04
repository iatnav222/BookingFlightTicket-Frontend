import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, FaCoins, FaShoppingCart, FaPlaneDeparture, FaUsers,
  FaLongArrowAltRight, FaCheckCircle, FaTimesCircle, FaClock
} from 'react-icons/fa';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, Filler
);

const Adminhome = () => {
  const stats = { doanhThu: 27639999, tongDonHang: 12, chuyenBaySapToi: 0, khachHang: 11 };

  const topRoutes = [
    { id: 1, di: 'Hồ Chí Minh', den: 'Hà Nội', hang: 'VietJet Air', ve: 3 },
    { id: 2, di: 'Hà Nội', den: 'Đà Nẵng', hang: 'Vietnam Airlines', ve: 3 },
    { id: 3, di: 'Đà Nẵng', den: 'Hà Nội', hang: 'Bamboo Airways', ve: 2 },
  ];

  const recentTransactions = [
    { id: 'WZWAUFK0', khach: 'abc', tien: 9999999, trangThai: 1 },
    { id: 'EGG4BPAR', khach: 'abc', tien: 9999999, trangThai: 0 },
    { id: 'CX1SS36V', khach: 'test', tien: 3240000, trangThai: 1 },
  ];

  const renderStatusIcon = (status) => {
    switch(status) {
      case 1: return <FaCheckCircle className="text-[#1cc88a] text-lg" title="Thành công" />;
      case 2: return <FaTimesCircle className="text-gray-500 text-lg" title="Đã hủy" />;
      default: return <FaClock className="text-[#f6c23e] text-lg" title="Chờ xử lý" />;
    }
  };

  const lineChartData = {
    labels: ['T05/2025', 'T07/2025', 'T09/2025', 'T11/2025', 'T01/2026', 'T03/2026'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [0, 0, 0, 0, 17500000, 0, 10000000, 0],
        borderColor: '#4e73df', 
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#4e73df',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4e73df',
        pointRadius: 3,
        pointHoverRadius: 3,
        fill: true,
        tension: 0.3, // Độ cong giống biểu đồ gốc
      },
    ],
  };

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
        ticks: { maxTicksLimit: 7 }
      }
    },
    plugins: { legend: { display: false } }
  };

  const doughnutChartData = {
    labels: ['Thành công', 'Chờ xử lý', 'Đã hủy'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ['#1cc88a', '#f6c23e', '#858796'],
        hoverBackgroundColor: ['#17a673', '#dda20a', '#60616f'],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%', // Vòng cung mỏng giống bản Blade
    plugins: { legend: { display: false } }
  };

  return (
    <div className="font-sans text-gray-800 antialiased">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <h2 className="text-[1.75rem] font-bold text-[#4e73df] m-0">Tổng quan hệ thống</h2>
        <span className="flex items-center gap-1 text-gray-500 text-sm">
          <FaCalendarAlt className="mr-1" /> 04/04/2026
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        
        {/* Doanh Thu */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#1cc88a] py-2 transition-transform hover:-translate-y-1 cursor-pointer">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#1cc88a] uppercase mb-1">Doanh Thu (Thực)</div>
                {/* Giảm size text xuống text-xl (h5) để vừa 1 dòng */}
                <div className="text-xl font-bold text-[#5a5c69]">
                  {stats.doanhThu.toLocaleString('vi-VN')} VND
                </div>
              </div>
              {/* Giữ icon cố định size 2rem, không bị thu nhỏ */}
              <div className="shrink-0">
                <FaCoins className="text-[2rem] text-gray-300 opacity-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Tổng Đơn Hàng */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#4e73df] py-2 transition-transform hover:-translate-y-1 cursor-pointer">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#4e73df] uppercase mb-1">Tổng Đơn Hàng</div>
                <div className="text-xl font-bold text-[#5a5c69]">{stats.tongDonHang}</div>
              </div>
              <div className="shrink-0">
                <FaShoppingCart className="text-[2rem] text-gray-300 opacity-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Chuyến Bay Sắp Tới */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#36b9cc] py-2 transition-transform hover:-translate-y-1 cursor-pointer">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#36b9cc] uppercase mb-1">Chuyến Bay Sắp Tới</div>
                <div className="text-xl font-bold text-[#5a5c69]">{stats.chuyenBaySapToi}</div>
              </div>
              <div className="shrink-0">
                <FaPlaneDeparture className="text-[2rem] text-gray-300 opacity-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Khách Hàng */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] border-l-[4px] border-l-[#f6c23e] py-2 transition-transform hover:-translate-y-1 cursor-pointer">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="mr-2">
                <div className="text-[11px] font-bold text-[#f6c23e] uppercase mb-1">Khách Hàng</div>
                <div className="text-xl font-bold text-[#5a5c69]">{stats.khachHang}</div>
              </div>
              <div className="shrink-0">
                <FaUsers className="text-[2rem] text-gray-300 opacity-100" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="bg-white rounded-[0.35rem] shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] lg:col-span-2 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-[0.35rem]">
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Biểu Đồ Doanh Thu (12 Tháng)</h6>
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
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Tỷ Lệ Trạng Thái Đơn</h6>
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
            <h6 className="font-bold text-[#4e73df] m-0 text-sm">Top Chặng Bay Bán Chạy</h6>
          </div>
          <div className="p-4">
            {topRoutes.map((route, index) => (
              <React.Fragment key={route.id}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-sm">{route.di}</span>
                      <FaLongArrowAltRight className="text-gray-400 text-xs mx-1" />
                      <span className="font-bold text-[#4e73df] text-sm">{route.den}</span>
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{route.hang}</div>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold text-white bg-[#e74a3b] rounded-full">{route.ve} vé</span>
                </div>
                {index !== topRoutes.length - 1 && <hr className="my-3 border-gray-200 opacity-100" />}
              </React.Fragment>
            ))}
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
                  <th className="px-4 py-2.5 text-sm font-semibold">Mã</th>
                  <th className="px-4 py-2.5 text-sm font-semibold">Khách</th>
                  <th className="px-4 py-2.5 text-sm font-semibold">Tiền (VND)</th>
                  <th className="px-4 py-2.5 text-sm font-semibold">TT</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#4e73df]">#{tx.id}</td>
                    <td className="px-4 py-3 text-[13px] text-gray-700">{tx.khach}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#e74a3b]">{new Intl.NumberFormat('vi-VN').format(tx.tien)}</td>
                    <td className="px-4 py-3">
                      {renderStatusIcon(tx.trangThai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Adminhome;