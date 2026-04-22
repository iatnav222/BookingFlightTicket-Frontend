import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import { orderApi } from '../../../services/orderApi';

const ThanhToan = () => {
  const { maDonHang } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  const handleVNPay = async () => {
    setLoading(true);
    try {
      const res = await orderApi.taoUrlThanhToan(maDonHang);
      if (res.success && res.data.payment_url) {
        window.location.href = res.data.payment_url;
      }
    } catch (err) {
      alert('Không thể kết nối với cổng thanh toán VNPAY hiện tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f8fb] min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="text-green-500 text-3xl" />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-2">Thanh toán an toàn</h2>
          <p className="text-gray-500 mb-8">Vui lòng chọn phương thức thanh toán để hoàn tất đặt vé</p>

          <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left">
              <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-bold">#{state?.order?.maCodeDonHang || maDonHang}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold">Tổng thanh toán:</span>
                  <span className="text-2xl font-black text-[#007bff]">
                      {(state?.order?.tongTien || 0).toLocaleString('vi-VN')} VND
                  </span>
              </div>
          </div>

          <button
            onClick={handleVNPay}
            disabled={loading}
            className="w-full bg-[#007bff] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0056b3] transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
          >
            <FaCreditCard /> {loading ? 'Đang chuyển hướng...' : 'Thanh toán qua VNPAY'}
          </button>
          
          <p className="text-xs text-gray-400 mt-6 italic">
            (*) Bạn sẽ được chuyển đến cổng thanh toán an toàn VNPAY
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;