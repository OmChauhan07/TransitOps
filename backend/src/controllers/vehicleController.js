const { prisma } = require('../config/database');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, acquisitionCost, status } = req.body;
    
    // Check uniqueness (handled mostly by Prisma unique constraint, but good for friendly errors)
    const existing = await prisma.vehicle.findUnique({ where: { registrationNumber } });
    if (existing) {
      return res.status(400).json({ error: 'Registration number already exists.' });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        name,
        type,
        maxLoadCapacity: parseFloat(maxLoadCapacity),
        acquisitionCost: parseFloat(acquisitionCost),
        status: status || 'AVAILABLE',
      }
    });
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Registration number already exists.' });
    }
    res.status(500).json({ error: 'Failed to create vehicle.' });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { registrationNumber, name, type, maxLoadCapacity, acquisitionCost, status } = req.body;
    
    const data = {
      registrationNumber,
      name,
      type,
      maxLoadCapacity: parseFloat(maxLoadCapacity),
      acquisitionCost: parseFloat(acquisitionCost),
    };

    if (status) {
      data.status = status;
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data
    });
    res.json(vehicle);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Registration number already exists.' });
    }
    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({ where: { id } });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
};

module.exports = {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
