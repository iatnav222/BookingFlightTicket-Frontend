import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHome } from 'react-icons/fa';

const KetQuaThanhToan = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const maCode = searchParams.get('maCode');

  const isSuccess = status === 'success';

  return (
    <div className="bg-[#f6f8fb] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl text-center border border-gray-100">
        {isSuccess ? (
          <>
            <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-4">Tuyệt vời!</h2>
            <p className="text-gray-600 mb-6">
              Giao dịch của bạn đã thành công. Thông tin vé điện tử sẽ được gửi qua email của bạn.
            </p>
            <div className="bg-green-50 rounded-2xl p-4 mb-8">
                <span className="text-sm text-green-700 block mb-1 font-bold uppercase">Mã đặt chỗ (PNR)</span>
                <span className="text-3xl font-black text-green-600 tracking-widest">{maCode}</span>
            </div>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-7xl text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-4">Rất tiếc!</h2>
            <p className="text-gray-600 mb-8">
              Thanh toán không thành công hoặc đã bị hủy. Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại.
            </p>
          </>
        )}

        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
        >
          <FaHome /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default KetQuaThanhToan;