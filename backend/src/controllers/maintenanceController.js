const { prisma } = require('../config/database');
const maintenanceService = require('../services/maintenanceService');

const getLogs = async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: {
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance logs.' });
  }
};

const openLog = async (req, res) => {
  try {
    const { vehicleId, description, cost } = req.body;
    if (!vehicleId || !description || cost === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const log = await maintenanceService.open(vehicleId, description, cost);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const closeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await maintenanceService.close(id);
    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await maintenanceService.deleteLog(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getLogs,
  openLog,
  closeLog,
  deleteLog
};
