const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Mã nhân viên là bắt buộc'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Nam', 'Nữ', 'Khác'],
      default: 'Nam',
    },
    dateOfBirth: {
      type: String,
    },
    department: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    hireDate: {
      type: String,
    },
    status: {
      type: String,
      default: 'Đang làm việc',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
