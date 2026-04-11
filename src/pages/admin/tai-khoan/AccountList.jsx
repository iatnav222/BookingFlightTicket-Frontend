import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaSyncAlt, FaTrash, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { accountApi } from '../../../services/accountApi';

const AccountList = () => {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [filters, setFilters] = useState({
        role: '',
        search: ''
    });

    const fetchData = useCallback(async () => {
        const res = await accountApi.getDanhSach(filters);
        setAccounts(res.data || []);
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id) => {
        if (window.confirm("Xóa tài khoản?")) {
            await accountApi.xoa(id);
            fetchData();
        }
    };

    const handleChangeRole = async (id, role) => {
        await accountApi.capNhat(id, { role });
        fetchData();
    };

    const renderRole = (role) => {
        const map = {
            admin: 'bg-red-100 text-red-600',
            staff: 'bg-blue-100 text-blue-600',
            user: 'bg-green-100 text-green-600'
        };
        return <span className={`px-2 py-1 rounded ${map[role]}`}>{role}</span>;
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow">

            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Quản lý tài khoản</h2>

                <button
                    onClick={() => navigate('/admin/tai-khoan/tao')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    + Thêm tài khoản
                </button>
            </div>

            {/* FILTER */}
            <div className="flex gap-2 mb-4">
                <select
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    className="border p-2"
                >
                    <option value="">Tất cả role</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Nhân viên</option>
                    <option value="user">User</option>
                </select>

                <input
                    placeholder="Tìm email..."
                    className="border p-2 flex-1"
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />

                <button onClick={fetchData} className="bg-blue-500 text-white px-3">
                    <FaSearch />
                </button>

                <button onClick={() => setFilters({ role: '', search: '' })} className="bg-gray-400 text-white px-3">
                    <FaSyncAlt />
                </button>
            </div>

            {/* TABLE */}
            <table className="w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Họ tên</th>
                        <th>Role</th>
                        <th>Đổi quyền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {accounts.map(acc => (
                        // 1. Sửa acc.id thành acc.maTK
                        <tr key={acc.maTK} className="border-t">
                            <td>#{acc.maTK}</td>
                            <td>{acc.email}</td>
                            
                            {/* 2. Sửa acc.name thành acc.hoten */}
                            <td>{acc.hoten}</td>
                            
                            {/* 3. Sửa acc.role thành acc.quyen */}
                            <td>{renderRole(acc.quyen)}</td>

                            {/* 🔥 phân quyền nhanh */}
                            <td>
                                <select
                                    value={acc.quyen}
                                    onChange={(e) => handleChangeRole(acc.maTK, e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                    <option value="user">User</option>
                                </select>
                            </td>

                            <td className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/admin/tai-khoan/${acc.maTK}`)}
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    <FaUserShield />
                                </button>

                                <button
                                    onClick={() => handleDelete(acc.maTK)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountList;