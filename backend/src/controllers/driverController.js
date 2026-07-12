const { prisma } = require('../config/database');

const getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers.' });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, status } = req.body;
    
    const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
    if (existing) {
      return res.status(400).json({ error: 'License number already exists.' });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate: new Date(licenseExpiryDate),
        contactNumber,
        status: status || 'AVAILABLE',
      }
    });
    res.status(201).json(driver);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'License number already exists.' });
    }
    res.status(500).json({ error: 'Failed to create driver.' });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, status } = req.body;
    
    const data = {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate) : undefined,
      contactNumber,
    };

    if (status) {
      data.status = status;
    }

    const driver = await prisma.driver.update({
      where: { id },
      data
    });
    res.json(driver);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'License number already exists.' });
    }
    res.status(500).json({ error: 'Failed to update driver.' });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.driver.delete({ where: { id } });
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete driver.' });
  }
};

module.exports = {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver
};
