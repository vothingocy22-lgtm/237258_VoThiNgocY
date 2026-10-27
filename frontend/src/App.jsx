import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './services/api';
import EmployeeModal from './components/EmployeeModal';
import { Search, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await getEmployees(searchQuery);
      setEmployees(response.data.data);
    } catch (err) {
      showAlert('Không thể tải danh sách nhân viên từ API!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleSaveEmployee = async (formData) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee._id, formData);
      showAlert('Cập nhật thông tin nhân viên thành công!');
    } else {
      await createEmployee(formData);
      showAlert('Thêm nhân viên mới thành công!');
    }
    fetchEmployees(search);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}" không?`)) {
      try {
        await deleteEmployee(id);
        showAlert('Xóa nhân viên thành công!');
        fetchEmployees(search);
      } catch (err) {
        showAlert('Xóa thất bại!', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            HỆ THỐNG QUẢN LÝ NHÂN SỰ (237258_VoThiNgocY)
          </h1>
        </div>

        {alert.show && (
          <div
            className={`p-4 mb-6 rounded-lg text-white font-medium ${
              alert.type === 'error' ? 'bg-red-500' : 'bg-green-600'
            }`}
          >
            {alert.message}
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearch} className="flex w-full md:w-1/2 gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã nhân viên hoặc họ tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded focus:outline-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <Search size={18} /> Tìm
            </button>
          </form>

          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 w-full md:w-auto justify-center"
          >
            <Plus size={18} /> Thêm nhân viên
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 flex justify-center items-center gap-2">
              <RefreshCw className="animate-spin" /> Đang tải dữ liệu...
            </div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy nhân viên nào trong hệ thống.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-xs">
                  <th className="p-3 border">Mã NV</th>
                  <th className="p-3 border">Họ và Tên</th>
                  <th className="p-3 border">Phòng ban</th>
                  <th className="p-3 border">Chức vụ</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">SĐT</th>
                  <th className="p-3 border">Trạng thái</th>
                  <th className="p-3 border text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="p-3 border font-semibold text-blue-600">{emp.employeeId}</td>
                    <td className="p-3 border font-medium">{emp.fullName}</td>
                    <td className="p-3 border">{emp.department || '-'}</td>
                    <td className="p-3 border">{emp.position || '-'}</td>
                    <td className="p-3 border">{emp.email}</td>
                    <td className="p-3 border">{emp.phone || '-'}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          emp.status === 'Đang làm việc'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingEmployee(emp);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id, emp.fullName)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveEmployee}
        editingEmployee={editingEmployee}
      />
    </div>
  );
}
