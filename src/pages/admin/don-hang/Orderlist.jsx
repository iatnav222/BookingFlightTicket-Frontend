import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaSearch, FaSyncAlt, FaTrash, FaBoxOpen,
    FaAngleLeft, FaAngleRight, FaEye, FaUser, FaTicketAlt
} from 'react-icons/fa';
import { orderApi } from '../../../services/orderApi';

const OrderList = () => {
    const [allOrders, setAllOrders] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ trangThai: '', search: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrders({});
    }, []);

    const fetchOrders = async (queryFilters) => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(queryFilters).filter(([_, v]) => v !== '')
            );
            const response = await orderApi.getDanhSach(activeFilters);
            let data = response.data || response;

            // Xử lý parse JSON cho thongTinLienHe nếu backend chưa parse
            const formattedData = data.map(item => ({
                ...item,
                contact: typeof item.thongTinLienHe === 'string' 
                         ? JSON.parse(item.thongTinLienHe) 
                         : item.thongTinLienHe
            }));

            setAllOrders(formattedData);
            setCurrentPage(1);
        } catch (error) { 
            console.error("Lỗi lấy danh sách:", error); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
            try {
                await orderApi.xoaDonHang(id);
                fetchOrders(filters);
            } catch (error) { alert("Lỗi xóa dữ liệu."); }
        }
    };

    // Render trạng thái theo tinyint(1) trong SQL
    const renderStatus = (status) => {
        switch(Number(status)) {
            case 0: return <span className="px-2 py-1 text-[10px] font-bold rounded bg-yellow-100 text-yellow-700 border border-yellow-200">CHỜ THANH TOÁN</span>;
            case 1: return <span className="px-2 py-1 text-[10px] font-bold rounded bg-green-100 text-green-700 border border-green-200">ĐÃ THANH TOÁN</span>;
            case 2: return <span className="px-2 py-1 text-[10px] font-bold rounded bg-red-100 text-red-700 border border-red-200">ĐÃ HỦY</span>;
            default: return <span className="px-2 py-1 text-[10px] font-bold rounded bg-gray-100 text-gray-700">KHOÁ</span>;
        }
    };

    const totalPages = Math.ceil(allOrders.length / itemsPerPage);
    const currentItems = allOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="container-fluid px-4 mt-4 font-['Nunito'] text-[#5a5c69]">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg uppercase">Quản Lý Đơn Hàng</h6>
                </div>

                <div className="p-4">
                    {/* Bộ lọc giống ChuyenBayList */}
                    <div className="mb-4 bg-[#f8f9fc] p-4 rounded border border-gray-200 flex flex-wrap gap-3 items-center">
                        <select name="trangThai" value={filters.trangThai} onChange={handleFilterChange} className="text-sm p-2 border rounded border-gray-300 outline-none bg-white font-semibold">
                            <option value="">-- Tất cả trạng thái --</option>
                            <option value="0">Chờ thanh toán</option>
                            <option value="1">Đã thanh toán</option>
                            <option value="2">Đã hủy</option>
                        </select>
                        <div className="flex flex-1 min-w-[300px]">
                            <input 
                                type="text" 
                                name="search" 
                                value={filters.search} 
                                onChange={handleFilterChange} 
                                placeholder="Tìm theo Mã đơn hoặc Mã PNR..." 
                                className="w-full text-sm p-2 border border-r-0 border-gray-300 rounded-l outline-none" 
                            />
                            <button onClick={() => fetchOrders(filters)} className="px-4 bg-[#4e73df] text-white rounded-r hover:bg-[#2e59d9]"><FaSearch /></button>
                        </div>
                        <button onClick={() => { setFilters({trangThai:'', search:''}); fetchOrders({}); }} className="px-3 py-2 text-sm text-white bg-[#858796] rounded hover:bg-[#717384]"><FaSyncAlt/></button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left align-middle border-collapse">
                            <thead className="bg-[#4e73df] text-white text-[13px] uppercase">
                                <tr>
                                    <th className="p-3 border-b font-bold text-center">Mã Đơn</th>
                                    <th className="p-3 border-b font-bold">Mã PNR</th>
                                    <th className="p-3 border-b font-bold">Người đặt</th>
                                    <th className="p-3 border-b font-bold text-right">Tổng Tiền</th>
                                    <th className="p-3 border-b font-bold text-center">Trạng Thái</th>
                                    <th className="p-3 border-b font-bold text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-10 font-bold text-blue-500">Đang tải...</td></tr>
                                ) : currentItems.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-10"><FaBoxOpen className="mx-auto text-3xl opacity-20"/><p className="mt-2">Không có đơn hàng nào</p></td></tr>
                                ) : (
                                    currentItems.map(item => (
                                        <tr key={item.maDonHang} className="hover:bg-gray-50 border-b">
                                            <td className="p-3 text-center font-bold text-gray-800">{item.maCodeDonHang}</td>
                                            <td className="p-3 text-center">
                                                {item.maDatChoHang ? (
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono font-bold border border-blue-100 uppercase italic">
                                                        <FaTicketAlt className="inline mr-1 text-[10px]"/>{item.maDatChoHang}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">Chưa cấp</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-bold text-[#4e73df]"><FaUser className="inline mr-1 text-[10px]"/> {item.contact?.ten}</div>
                                                <div className="text-[11px] text-gray-500">{item.contact?.email}</div>
                                            </td>
                                            <td className="p-3 text-right font-black text-orange-600">
                                                {parseFloat(item.tongTien).toLocaleString()}đ
                                            </td>
                                            <td className="p-3 text-center">
                                                {renderStatus(item.trangThai)}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    <Link to={`/admin/don-hang/${item.maDonHang}`} className="w-8 h-8 bg-[#36b9cc] text-white rounded flex items-center justify-center hover:bg-[#2c9faf] shadow-sm" title="Xem chi tiết">
                                                        <FaEye size={12}/>
                                                    </Link>
                                                    <button onClick={() => handleDelete(item.maDonHang)} className="w-8 h-8 bg-[#e74a3b] text-white rounded flex items-center justify-center hover:bg-[#be2617] shadow-sm">
                                                        <FaTrash size={12}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang đồng bộ style */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-xs text-gray-500 italic">Hiển thị đơn hàng {currentPage} trên {totalPages}</p>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-2 border rounded hover:bg-gray-100 text-xs"><FaAngleLeft/></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded text-xs border ${currentPage === i+1 ? 'bg-[#4e73df] text-white border-[#4e73df]' : 'hover:bg-gray-100'}`}>{i+1}</button>
                                ))}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="p-2 border rounded hover:bg-gray-100 text-xs"><FaAngleRight/></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderList;