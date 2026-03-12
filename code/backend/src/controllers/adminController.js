// backend/src/controllers/adminController.js

const adminService = require('../services/adminService');

async function getAdminSummary(req, res) {
  try {
    // call the service to get summary data
    const summary = await adminService.getAdminSummary();

    // send response to client
    res.status(200).json(summary);

  } catch (error) {
    console.error('Admin summary error:', error);

    res.status(500).json({
      message: 'Failed to fetch admin summary'
    });
  }
}

module.exports = {
  getAdminSummary
};