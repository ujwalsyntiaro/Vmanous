const prisma = require('../config/prisma');

// Get all colleges from MySQL database
const getColleges = async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: colleges });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create a new college
const createCollege = async (req, res) => {
  try {
    const { name, location, contactPerson, email, phone, mouStatus, studentsCount } = req.body;
    const newCollege = await prisma.college.create({
      data: {
        name,
        location: location || 'Maharashtra',
        contactPerson,
        email,
        phone,
        mouStatus: mouStatus || 'Active MOU',
        studentsCount: Number(studentsCount) || 0
      }
    });
    res.status(201).json({ success: true, data: newCollege });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ success: false, error: 'Failed to create college' });
  }
};

// Update college
const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await prisma.college.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        studentsCount: updateData.studentsCount ? Number(updateData.studentsCount) : undefined
      }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating college:', error);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};

// Delete college
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.college.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'College deleted' });
  } catch (error) {
    console.error('Error deleting college:', error);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

module.exports = {
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege
};
