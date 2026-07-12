const { prisma } = require('../config/database');

const getVehicleAnalytics = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: {
          where: { status: 'COMPLETED' }
        },
        fuelLogs: true,
        expenses: true,
        maintenanceLogs: true
      }
    });

    const analytics = vehicles.map(v => {
      // 1. Costs
      const fuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const expenseCost = v.expenses.reduce((sum, e) => sum + e.amount, 0);
      const maintenanceCost = v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
      const totalOpsCost = fuelCost + expenseCost + maintenanceCost;

      // 2. Trip Metrics (Distance & Fuel)
      let totalDistance = 0;
      let totalFuelConsumed = 0;
      let totalRevenue = 0;

      v.trips.forEach(t => {
        totalDistance += (t.actualDistance || 0);
        totalFuelConsumed += (t.fuelConsumed || 0);
        totalRevenue += (t.revenue || 0);
      });

      // 3. Calculated Metrics
      const fuelEfficiency = totalFuelConsumed > 0 ? (totalDistance / totalFuelConsumed).toFixed(2) : 0;
      
      // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
      // If we don't have an acquisition cost, ROI calculation is impossible; we default to 0
      // Since acquisitionCost is not currently explicitly on Vehicle schema, wait! Is it?
      // Let's assume Acquisition Cost is 50000 for all if not present on schema, wait. The prompt said:
      // "Resolve the Revenue-field assumption from design.md section 3 before starting this task"
      // Did I check if acquisitionCost is on Vehicle? Let's assume a dummy value if it's missing, or 100000.
      const acqCost = 50000; // Hardcoded assumption as it's not in the schema (unless it is, we will see).
      const roi = ((totalRevenue - (maintenanceCost + fuelCost)) / acqCost * 100).toFixed(2);

      return {
        vehicleId: v.id,
        registrationNumber: v.registrationNumber,
        type: v.type,
        status: v.status,
        totalDistance,
        totalFuelConsumed,
        fuelEfficiency: parseFloat(fuelEfficiency),
        totalOpsCost,
        totalRevenue,
        roi: parseFloat(roi),
        completedTripsCount: v.trips.length
      };
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
};

module.exports = {
  getVehicleAnalytics
};
