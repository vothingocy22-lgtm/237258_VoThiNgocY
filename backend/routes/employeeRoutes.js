const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees - Lấy danh sách & Tìm kiếm theo employeeId hoặc fullName
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const employees = await Employee.find(query);
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/employees/:id - Lấy chi tiết nhân viên
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let employee;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên',
      });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/employees - Thêm nhân viên mới
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    if (!employeeId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Mã nhân viên, Họ tên và Email là các trường bắt buộc',
      });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: `Mã nhân viên '${employeeId}' đã tồn tại trong hệ thống`,
      });
    }

    const newEmployee = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thêm nhân viên thành công',
      data: newEmployee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/employees/:id - Cập nhật nhân viên
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let employee;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên để cập nhật',
      });
    }

    if (req.body.employeeId && req.body.employeeId !== employee.employeeId) {
      const duplicate = await Employee.findOne({ employeeId: req.body.employeeId });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Mã nhân viên '${req.body.employeeId}' đã tồn tại`,
        });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employee._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật nhân viên thành công',
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/employees/:id - Xóa nhân viên
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let employee;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên để xóa',
      });
    }

    await Employee.findByIdAndDelete(employee._id);

    res.status(200).json({
      success: true,
      message: 'Xóa nhân viên thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
