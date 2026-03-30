import React, { useEffect, useState } from 'react';
import api from './api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const fetchUsers = () => {
        setLoading(true);
        api.get('/users')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newName.trim()) return alert("Vui lòng nhập tên!");
        api.post('/users', { name: newName })
            .then(() => { setNewName(""); fetchUsers(); })
            .catch(error => { console.error("Lỗi khi thêm:", error); fetchUsers(); });
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            api.delete(`/users/${id}`)
                .then(() => fetchUsers())
                .catch(error => { console.error("Lỗi khi xóa:", error); fetchUsers(); });
        }
    };

    const startEdit = (user) => { setEditingId(user.id); setEditName(user.name); };

    const saveEdit = (id) => {
        api.put(`/users/${id}`, { name: editName })
            .then(() => { setEditingId(null); fetchUsers(); })
            .catch(error => { console.error("Lỗi khi cập nhật:", error); setEditingId(null); fetchUsers(); });
    };

    if (loading && users.length === 0) return (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Đang tải dữ liệu người dùng...</p>
        </div>
    );

    return (
        <div className="bg-white shadow rounded-xl p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">Quản lý người dùng</h2>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Tổng: {users.length} users
                </span>
            </div>

            {/* Form thêm người dùng */}
            <form onSubmit={handleAddUser} className="flex gap-2 mb-6">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập họ và tên người dùng mới..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
                >
                    Thêm
                </button>
            </form>

            {/* Bảng danh sách */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-center w-16">ID</th>
                            <th className="px-4 py-3">Họ và Tên</th>
                            <th className="px-4 py-3 text-center w-40">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                                >
                                    <td className="px-4 py-3 text-center text-gray-400 font-semibold">
                                        #{user.id}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingId === user.id ? (
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-800">{user.name}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {editingId === user.id ? (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => saveEdit(user.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded transition"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="bg-gray-400 hover:bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded transition"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="border border-cyan-500 text-cyan-600 hover:bg-cyan-50 text-xs font-medium px-3 py-1 rounded transition"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="border border-red-400 text-red-500 hover:bg-red-50 text-xs font-medium px-3 py-1 rounded transition"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-gray-400 py-8">
                                    Không có dữ liệu người dùng nào trên hệ thống.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;