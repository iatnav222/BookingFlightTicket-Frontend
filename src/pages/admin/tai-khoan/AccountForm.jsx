import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { accountApi } from '../../../services/accountApi';

const AccountForm = () => {
    const { id } = useParams();
    const isEdit = !!id;

    const [form, setForm] = useState({
        hoten: '',
        email: '',
        userhoten: '',
        password: '',
        password_confirmation: '',
        quyen: 'user'
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            accountApi.getChiTiet(id).then(res => {
                const data = res.data || res;
                // Dùng prevForm (trạng thái trước đó) thay vì gọi trực tiếp biến form
                setForm(prevForm => ({
                    ...prevForm,
                    ...data,
                    password: '',
                    password_confirmation: ''
                }));
            });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { hoten, value } = e.target;
        setForm(prev => ({ ...prev, [hoten]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 🔐 validate password
        if (!isEdit && form.password !== form.password_confirmation) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            if (isEdit) {
                await accountApi.capNhat(id, form);
            } else {
                await accountApi.tao(form);
            }
            alert("Thành công");
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi server");
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow max-w-lg">
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
            </h2>

            {error && (
                <div className="mb-3 text-red-500">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

                {/* Họ tên */}
                <input
                    hoten="hoten"
                    placeholder="Họ tên"
                    value={form.hoten}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                />

                {/* Email */}
                <input
                    hoten="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                />

                {/* Username */}
                <input
                    hoten="username"
                    placeholder="Tên đăng nhập"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                />

                {/* Password chỉ hiện khi tạo */}
                {!isEdit && (
                    <>
                        <input
                            type="password"
                            hoten="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border p-2"
                            required
                        />

                        <input
                            type="password"
                            hoten="password_confirmation"
                            placeholder="Nhập lại mật khẩu"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="w-full border p-2"
                            required
                        />
                    </>
                )}

                {/* Role */}
                <select
                    hoten="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border p-2"
                >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="user">User</option>
                </select>

                <button className="bg-blue-500 text-white px-4 py-2 w-full">
                    Lưu
                </button>
            </form>
        </div>
    );
};

export default AccountForm;