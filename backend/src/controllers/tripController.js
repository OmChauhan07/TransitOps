const { prisma } = require('../config/database');
const tripService = { dispatch, complete, cancel } = require('../services/tripService');

const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips.' });
  }
};

const createTrip = async (req, res) => {
  try {
    const { source, destination, cargoWeight, plannedDistance, vehicleId, driverId } = req.body;
    
    // We don't dispatch here. It starts in DRAFT.
    const trip = await prisma.trip.create({
      data: {
        source,
        destination,
        cargoWeight: parseFloat(cargoWeight),
        plannedDistance: parseFloat(plannedDistance),
        vehicleId,
        driverId,
        status: 'DRAFT'
      },
      include: {
        vehicle: true,
        driver: true
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip.' });
  }
};

const dispatchTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await dispatch(id);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const completeTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualDistance, fuelConsumed, revenue } = req.body;
    const trip = await complete(id, actualDistance, fuelConsumed, revenue);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await cancel(id);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    // We only allow deleting DRAFT trips
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status !== 'DRAFT') return res.status(400).json({ error: 'Can only delete DRAFT trips' });

    await prisma.trip.delete({ where: { id } });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip.' });
  }
};

module.exports = {
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip
};
