import React, { useEffect, useState } from 'react';
import api from './api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State dùng cho chức năng Thêm
    const [newName, setNewName] = useState("");

    // State dùng cho chức năng Sửa
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    // Hàm lấy danh sách người dùng
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

    // Hàm Thêm người dùng
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newName.trim()) return alert("Vui lòng nhập tên!");

        api.post('/users', { name: newName })
            .then(() => {
                setNewName(""); // Xóa trắng ô input
                fetchUsers();   // Tải lại danh sách
            })
            .catch(error => {
                console.error("Lỗi khi thêm:", error);
                fetchUsers(); // Vẫn tải lại phòng trường hợp backend trả về redirect thay vì JSON
            });
    };

    // Hàm Xóa người dùng
    const handleDeleteUser = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            api.delete(`/users/${id}`)
                .then(() => {
                    fetchUsers();
                })
                .catch(error => {
                    console.error("Lỗi khi xóa:", error);
                    fetchUsers();
                });
        }
    };

    // Hàm Bật chế độ sửa
    const startEdit = (user) => {
        setEditingId(user.id);
        setEditName(user.name);
    };

    // Hàm Lưu sau khi sửa
    const saveEdit = (id) => {
        api.put(`/users/${id}`, { name: editName })
            .then(() => {
                setEditingId(null); // Tắt chế độ sửa
                fetchUsers();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật:", error);
                setEditingId(null);
                fetchUsers();
            });
    };

    // Giao diện khi đang tải
    if (loading && users.length === 0) return (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải dữ liệu người dùng...</p>
        </div>
    );

    return (
        <div className="p-4 bg-white shadow-sm rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold mb-0">Quản lý người dùng</h2>
                <span className="badge bg-success fs-6">Tổng: {users.length} users</span>
            </div>

            {/* Form Thêm người dùng */}
            <form onSubmit={handleAddUser} className="mb-4 d-flex gap-2">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nhập họ và tên người dùng mới..." 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-4">Thêm</button>
            </form>
            
            <div className="table-responsive">
                <table className="table table-hover align-middle border">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '10%', textAlign: 'center' }}>ID</th>
                            <th style={{ width: '60%' }}>Họ và Tên</th>
                            <th style={{ width: '30%', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="text-center text-secondary"><strong>#{user.id}</strong></td>
                                    
                                    {/* Cột Tên (Hiển thị Input nếu đang sửa, ngược lại hiển thị Text) */}
                                    <td>
                                        {editingId === user.id ? (
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            <span className="fw-semibold text-dark">{user.name}</span>
                                        )}
                                    </td>

                                    {/* Cột Thao tác */}
                                    <td className="text-center">
                                        {editingId === user.id ? (
                                            <>
                                                <button onClick={() => saveEdit(user.id)} className="btn btn-sm btn-success me-2">Lưu</button>
                                                <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary">Hủy</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(user)} className="btn btn-sm btn-outline-info me-2">Sửa</button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-outline-danger">Xóa</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted py-4">
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