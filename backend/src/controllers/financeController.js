const { prisma } = require('../config/database');

const getRecentLogs = async (req, res) => {
  try {
    // We fetch fuel logs and expenses, then merge and sort them.
    const fuelLogs = await prisma.fuelLog.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' },
      take: 50
    });
    
    const expenses = await prisma.expense.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' },
      take: 50
    });

    // Map to a unified structure
    const combined = [
      ...fuelLogs.map(f => ({
        id: `fuel-${f.id}`,
        originalId: f.id,
        category: 'FUEL',
        description: `${f.liters} Liters`,
        amount: f.cost,
        date: f.date,
        vehicle: f.vehicle
      })),
      ...expenses.map(e => ({
        id: `exp-${e.id}`,
        originalId: e.id,
        category: e.type, // TOLL, OTHER
        description: e.type,
        amount: e.amount,
        date: e.date,
        vehicle: e.vehicle
      }))
    ];

    // Sort combined by date desc
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(combined.slice(0, 50));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent logs.' });
  }
};

const getVehicleCosts = async (req, res) => {
  try {
    // Aggregate costs per vehicle
    const vehicles = await prisma.vehicle.findMany({
      include: {
        fuelLogs: true,
        expenses: true,
        maintenanceLogs: true
      }
    });

    const costs = vehicles.map(v => {
      const fuelTotal = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const expenseTotal = v.expenses.reduce((sum, e) => sum + e.amount, 0);
      const maintenanceTotal = v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
      
      return {
        vehicleId: v.id,
        registrationNumber: v.registrationNumber,
        fuelTotal,
        expenseTotal,
        maintenanceTotal,
        totalOperationalCost: fuelTotal + expenseTotal + maintenanceTotal
      };
    });

    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to aggregate costs.' });
  }
};

const addFuelLog = async (req, res) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;
    if (!vehicleId || liters === undefined || cost === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const log = await prisma.fuelLog.create({
      data: {
        vehicleId,
        liters: parseFloat(liters),
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date()
      }
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const { vehicleId, type, amount, date } = req.body;
    if (!vehicleId || !type || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = await prisma.expense.create({
      data: {
        vehicleId,
        type, // MUST be TOLL or OTHER based on ExpenseType enum
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date()
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRecentLogs,
  getVehicleCosts,
  addFuelLog,
  addExpense
};
