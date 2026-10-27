import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const initialFormState = {
  employeeId: '',
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '',
  department: '',
  position: '',
  email: '',
  phone: '',
  hireDate: '',
  status: 'Đang làm việc',
};

export default function EmployeeModal({ isOpen, onClose, onSubmit, editingEmployee }) {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee);
    } else {
      setFormData(initialFormState);
    }
    setError('');
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.fullName || !formData.email) {
      setError('Mã nhân viên, Họ tên và Email là bắt buộc!');
      return;
    }
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
          <h3 className="text-xl font-bold">
            {editingEmployee ? 'Cập Nhật Thông Tin Nhân Viên' : 'Thêm Nhân Viên Mới'}
          </h3>
          <button onClick={onClose} className="hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Mã nhân viên (*)</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              disabled={!!editingEmployee}
              className="w-full border p-2 rounded focus:outline-blue-500 disabled:bg-gray-100"
              placeholder="VD: NV004"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Họ và tên (*)</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email (*)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
              placeholder="an.nguyen@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Phòng ban</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Chức vụ</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Ngày vào làm</label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
            >
              <option value="Đang làm việc">Đang làm việc</option>
              <option value="Nghỉ phép">Nghỉ phép</option>
              <option value="Đã nghỉ việc">Đã nghỉ việc</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
              {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
