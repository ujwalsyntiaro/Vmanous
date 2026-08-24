const prisma = require('../config/prisma');

// Get all students from MySQL database
const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create a new student entry
const createStudent = async (req, res) => {
  try {
    const { name, email, phone, collegeName, branch, year, passCode } = req.body;
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        phone: phone || '',
        collegeName: collegeName || 'Partner Institution',
        branch,
        year,
        passCode
      }
    });
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, error: 'Failed to create student' });
  }
};

// Update student info / status
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const numId = Number(id);
    if (!isNaN(numId)) {
      const updated = await prisma.student.update({
        where: { id: numId },
        data: updateData
      });
      return res.json({ success: true, data: updated });
    }
    return res.json({ success: true, message: 'Updated in local state' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const numId = Number(id);
    if (!isNaN(numId)) {
      await prisma.student.delete({ where: { id: numId } });
    }
    return res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
};
