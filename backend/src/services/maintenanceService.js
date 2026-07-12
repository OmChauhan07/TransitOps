const { prisma } = require('../config/database');

const maintenanceService = {
  async open(vehicleId, description, cost) {
    return await prisma.$transaction(async (tx) => {
      // Validate vehicle
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle) throw new Error('Vehicle not found');
      
      // Allow moving a vehicle to IN_SHOP from AVAILABLE, but we might also allow it from other states,
      // but usually you can only open maintenance if it's AVAILABLE (or already IN_SHOP). 
      // The spec says: "Opening a maintenance record immediately removes that vehicle from the dispatch pool"
      // Let's just allow it regardless of status unless it's ON_TRIP. Let's say we can't maintain a vehicle ON_TRIP.
      if (vehicle.status === 'ON_TRIP') {
        throw new Error(`Vehicle ${vehicle.registrationNumber} is currently ON_TRIP and cannot be placed in maintenance.`);
      }

      // Create log
      const log = await tx.maintenanceLog.create({
        data: {
          vehicleId,
          description,
          cost: parseFloat(cost) || 0,
          status: 'OPEN'
        }
      });

      // Update vehicle status to IN_SHOP
      if (vehicle.status !== 'RETIRED') {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: 'IN_SHOP' }
        });
      }

      return log;
    });
  },

  async close(logId) {
    return await prisma.$transaction(async (tx) => {
      // Find log
      const log = await tx.maintenanceLog.findUnique({ 
        where: { id: logId },
        include: { vehicle: true } 
      });

      if (!log) throw new Error('Maintenance log not found');
      if (log.status !== 'OPEN') throw new Error('Maintenance log is already closed');

      // Update log to CLOSED
      const updatedLog = await tx.maintenanceLog.update({
        where: { id: logId },
        data: { status: 'CLOSED' }
      });

      // Update vehicle status back to AVAILABLE unless it is RETIRED
      if (log.vehicle.status !== 'RETIRED') {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: 'AVAILABLE' }
        });
      }

      return updatedLog;
    });
  },
  
  async deleteLog(logId) {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.findUnique({ 
        where: { id: logId },
        include: { vehicle: true } 
      });
      if (!log) throw new Error('Maintenance log not found');
      
      await tx.maintenanceLog.delete({ where: { id: logId } });
      
      // If the log was open and it's deleted, we should maybe revert the vehicle status, but it's simpler to just
      // say delete is only for cleanup of closed logs or we just enforce reverting to AVAILABLE if it was OPEN.
      if (log.status === 'OPEN' && log.vehicle.status !== 'RETIRED') {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: 'AVAILABLE' }
        });
      }
      return { message: 'Deleted' };
    });
  }
};

module.exports = maintenanceService;
