import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserShield, FaUserEdit, FaTrash, FaUserLock, FaPlus, FaUser } from 'react-icons/fa';
import { accountApi } from '../../../services/accountApi';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchAccounts(); }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await accountApi.getDanhSach();
            // Đảm bảo accounts luôn là mảng để không bị lỗi .filter
            setAccounts(Array.isArray(res) ? res : (res.data || []));
        } catch (err) { 
            console.error("Lỗi fetch:", err);
            setAccounts([]);
        } finally { setLoading(false); }
    };

    const renderRole = (quyen) => {
        if (quyen === 'admin') {
            return <span className="px-2 py-1 text-[10px] font-bold rounded bg-red-100 text-red-700 border border-red-200 uppercase"><FaUserShield className="inline mr-1"/> Quản trị</span>;
        }
        return <span className="px-2 py-1 text-[10px] font-bold rounded bg-blue-100 text-blue-700 border border-blue-200 uppercase"><FaUser className="inline mr-1"/> Khách hàng</span>;
    };

    // Lọc an toàn: Kiểm tra sự tồn tại của acc.username trước khi includes
    const filteredAccounts = accounts.filter(acc => 
        acc.username && acc.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid px-4 mt-4 font-['Nunito'] text-[#5a5c69]">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg uppercase">Quản Lý Tài Khoản</h6>
                </div>

                <div className="p-4">
                    <div className="mb-4 bg-[#f8f9fc] p-4 rounded border border-gray-200 flex flex-wrap gap-3 items-center">
                        <div className="flex flex-1 min-w-[300px]">
                            <input 
                                type="text" 
                                placeholder="Tìm theo tên đăng nhập (username)..." 
                                className="w-full text-sm p-2 border border-gray-300 rounded outline-none focus:border-[#4e73df]" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left align-middle border-collapse">
                            <thead className="bg-[#4e73df] text-white text-[13px] uppercase">
                                <tr>
                                    <th className="p-3 border-b font-bold text-center">Mã TK</th>
                                    <th className="p-3 border-b font-bold">Username</th>
                                    <th className="p-3 border-b font-bold">Họ Tên</th>
                                    <th className="p-3 border-b font-bold">Email</th>
                                    <th className="p-3 border-b font-bold text-center">Quyền</th>
                                    <th className="p-3 border-b font-bold text-center">Trạng Thái</th>
                                    <th className="p-3 border-b font-bold text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-10 font-bold text-blue-500">Đang tải...</td></tr>
                                ) : filteredAccounts.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-10 text-gray-400 italic">Không tìm thấy tài khoản nào</td></tr>
                                ) : (
                                    filteredAccounts.map(acc => (
                                        <tr key={acc.maTK} className="hover:bg-gray-50 border-b">
                                            <td className="p-3 text-center text-gray-500">#{acc.maTK}</td>
                                            <td className="p-3 font-bold text-[#4e73df]">{acc.username}</td>
                                            <td className="p-3">{acc.hoten || <span className="text-gray-300">Chưa cập nhật</span>}</td>
                                            <td className="p-3 text-gray-600">{acc.email}</td>
                                            <td className="p-3 text-center">{renderRole(acc.quyen)}</td>
                                            <td className="p-3 text-center">
                                                {/* SQL dùng bit(1), thường mapping về true/false hoặc 1/0 */}
                                                {acc.trangThai ? 
                                                    <span className="text-green-500 font-bold text-xs italic">Hoạt động</span> : 
                                                    <span className="text-red-500 font-bold text-xs italic">Đã khóa</span>
                                                }
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    <Link to={`/admin/tai-khoan/${acc.maTK}`} className="w-8 h-8 bg-[#f6c23e] text-white rounded flex items-center justify-center hover:bg-[#dda20a] shadow-sm">
                                                        <FaUserEdit size={12}/>
                                                    </Link>
                                                    <button className="w-8 h-8 bg-[#e74a3b] text-white rounded flex items-center justify-center hover:bg-[#be2617] shadow-sm">
                                                        <FaUserLock size={12}/>
                                                    </button>
                                                </div>
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

export default AccountList;