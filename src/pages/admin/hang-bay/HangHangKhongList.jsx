import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheckCircle, FaBan, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { hangHangKhongApi } from '../../../services/hangHangKhongApi'; 

const BACKEND_URL = 'https://bookingflightticket-backend-new.onrender.com/';

const HangHangKhongList = () => {
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const flightsPerPage = 10;
    const ref = useRef(null);
    // Đã bọc hàm fetch trong useCallback để theo dõi biến keyword
    const fetchAirlines = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hangHangKhongApi.getDanhSach({search: keyword });
            setAirlines(res.data.data || res.data); 
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
        } finally {
            setLoading(false);
        }
    }, [keyword]);

    // Tự động gọi lại API mỗi khi keyword thay đổi (gõ phím)
    useEffect(() => {
        fetchAirlines();
    }, [fetchAirlines]);

    const resetSearch = () => {
        setKeyword('');
    };

    const handleDelete = async (id, ten) => {
        if (window.confirm(`Bạn có chắc muốn xóa hãng ${ten}? Hành động này sẽ xóa cả máy bay và chuyến bay liên quan!`)) {
            try {
                await hangHangKhongApi.xoaHang(id);
                alert('Xóa thành công!');
                fetchAirlines(); 
            } catch (error) {
                alert("Không thể xóa hãng này.");
            }
        }
    };
    const ChuyenBayCuoi = currentPage*flightsPerPage;
    const ChuyenBayDau = ChuyenBayCuoi - flightsPerPage;
    const TrangHienTai = airlines.slice(ChuyenBayDau, ChuyenBayCuoi);
    const TongSoTrang = Math.ceil(airlines.length/flightsPerPage);
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-gray-800">
            <div className="bg-white rounded shadow-sm mb-4 border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-[#f8f9fc]">
                    <h5 ref={ref} className="m-0 font-bold text-[#4e73df] text-lg">Danh Sách Hãng Hàng Không</h5>
                    <Link to="/admin/hang-hang-khong/tao" className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-sm">
                        <FaPlus className="mr-1" /> Thêm Hãng Mới
                    </Link>
                </div>

                <div className="p-4">
                    <div className="mb-4 flex justify-end">
                        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Tìm tên hãng, mã code..." 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#4e73df] outline-none w-64"
                            />
                            <button type="submit" className="px-4 bg-[#4e73df] text-white rounded hover:bg-[#2e59d9] transition">
                                <FaSearch />
                            </button>
                            {keyword && (
                                <button type="button" onClick={resetSearch} className="px-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition" title="Xóa tìm kiếm">
                                    <FaSyncAlt />
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center text-sm">
                                <tr>
                                    <th className="p-3 border w-[5%]">ID</th>
                                    <th className="p-3 border w-[15%]">Logo</th>
                                    <th className="p-3 border">Tên Hãng</th>
                                    <th className="p-3 border w-[10%]">Mã Code</th>
                                    <th className="p-3 border w-[15%]">Trạng Thái</th>
                                    <th className="p-3 border w-[15%]">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-8">Đang tải dữ liệu...</td></tr>
                                ) : airlines.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">Không tìm thấy hãng hàng không nào.</td></tr>
                                ) : (
                                    TrangHienTai.map(hang => (
                                        <tr key={hang.maHang} className="hover:bg-gray-50 border-b align-middle">
                                            <td className="p-3 text-center">{hang.maHang}</td>
                                            <td className="p-3 text-center flex justify-center">
                                                {hang.logo_url ? (
                                                    <img 
                                                        src={hang.logo_url.startsWith('http') ? hang.logo_url : `${BACKEND_URL}${encodeURI(hang.logo_url)}`} 
                                                        alt="Logo" 
                                                        className="h-10 max-w-[100px] object-contain rounded bg-white p-1 border"
                                                        onError={(e) => { 
                                                            e.target.style.display='none'; 
                                                            e.target.nextSibling.style.display='inline-block'; 
                                                        }}
                                                    />
                                                ) : null}
                                                <span className="badge bg-gray-100 text-gray-500 border px-2 py-1 rounded text-xs" style={{ display: hang.logo_url ? 'none' : 'inline-block' }}>
                                                    No Logo
                                                </span>
                                            </td>
                                            <td className="p-3 font-bold text-[#4e73df]">{hang.tenHang}</td>
                                            <td className="p-3 text-center">
                                                <span className="bg-cyan-100 text-cyan-800 font-mono px-2 py-1 rounded text-sm">{hang.maCode}</span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {hang.trangThai ? (
                                                    <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                        <FaCheckCircle className="mr-1"/> Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                        <FaBan className="mr-1"/> Ngừng bay
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center whitespace-nowrap">
                                                <Link to={`/admin/hang-hang-khong/sua/${hang.maHang}`} className="inline-flex w-8 h-8 bg-[#f6c23e] hover:bg-[#dda20a] text-white rounded items-center justify-center transition mr-2">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(hang.maHang, hang.tenHang)} className="inline-flex w-8 h-8 bg-[#e74a3b] hover:bg-[#be2617] text-white rounded items-center justify-center transition">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {TongSoTrang> 1 &&(
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage-1)}
                                disabled={currentPage===1}
                                className="px-3 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                            >
                                <FaChevronLeft className="text-xs" />
                            </button>
                            {Array.from({ length: TongSoTrang }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 ${currentPage === page ? 'bg-[#4e73df] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage+1)}
                                disabled={currentPage===TongSoTrang}
                                className="px-3 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                            >
                                <FaChevronRight className="text-xs" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HangHangKhongList;