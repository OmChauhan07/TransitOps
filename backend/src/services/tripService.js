const { prisma } = require('../config/database');

const tripService = {
  async dispatch(tripId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get the trip and check its current status
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true, driver: true },
      });

      if (!trip) throw new Error('Trip not found');
      if (trip.status !== 'DRAFT') throw new Error('Only DRAFT trips can be dispatched');

      const { vehicle, driver } = trip;

      // 2. Validate Vehicle Status & Capacity
      if (vehicle.status !== 'AVAILABLE') {
        throw new Error(`Vehicle ${vehicle.registrationNumber} is not AVAILABLE`);
      }
      if (trip.cargoWeight > vehicle.maxLoadCapacity) {
        throw new Error(`Cargo weight (${trip.cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg)`);
      }

      // 3. Validate Driver Status & License Expiry
      if (driver.status !== 'AVAILABLE') {
        throw new Error(`Driver ${driver.name} is not AVAILABLE`);
      }
      if (driver.licenseExpiryDate && new Date(driver.licenseExpiryDate) < new Date()) {
        throw new Error(`Driver ${driver.name}'s license is expired`);
      }

      // 4. Update statuses
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'DISPATCHED' },
      });

      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: { status: 'ON_TRIP' },
      });

      await tx.driver.update({
        where: { id: driver.id },
        data: { status: 'ON_TRIP' },
      });

      return updatedTrip;
    });
  },

  async complete(tripId, actualOdometer, fuelConsumed) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId } });
      if (!trip) throw new Error('Trip not found');
      if (trip.status !== 'DISPATCHED') throw new Error('Only DISPATCHED trips can be completed');

      // Update trip with final metrics
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: {
          status: 'COMPLETED',
          actualOdometer: parseFloat(actualOdometer) || null,
          fuelConsumed: parseFloat(fuelConsumed) || null,
        },
      });

      // Update vehicle odometer and release it
      const currentVehicle = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } });
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: 'AVAILABLE',
          odometer: currentVehicle.odometer + (parseFloat(actualOdometer) || 0),
        },
      });

      // Release driver
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' },
      });

      return updatedTrip;
    });
  },

  async cancel(tripId) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId } });
      if (!trip) throw new Error('Trip not found');
      
      // We also allow cancelling a DRAFT trip directly without freeing resources if it hasn't dispatched
      if (trip.status === 'DRAFT') {
        return await tx.trip.update({
          where: { id: tripId },
          data: { status: 'CANCELLED' },
        });
      }

      if (trip.status !== 'DISPATCHED') throw new Error('Only DRAFT or DISPATCHED trips can be cancelled');

      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'CANCELLED' },
      });

      // Revert vehicle and driver to AVAILABLE since it was DISPATCHED
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' },
      });

      return updatedTrip;
    });
  },
};

module.exports = tripService;
