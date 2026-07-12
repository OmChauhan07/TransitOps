const { prisma } = require('../src/config/database');

async function main() {
  console.log('Clearing existing data (except Users)...');
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  console.log('Seeding Vehicles...');
  const v1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'VAN-100',
      name: 'Ford Transit',
      type: 'Van',
      maxLoadCapacity: 1500,
      odometer: 12500,
      acquisitionCost: 45000,
      status: 'AVAILABLE'
    }
  });

  const v2 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TRK-250',
      name: 'Mercedes Sprinter',
      type: 'Truck',
      maxLoadCapacity: 3500,
      odometer: 85000,
      acquisitionCost: 65000,
      status: 'AVAILABLE'
    }
  });

  const v3 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'VAN-05',
      name: 'Ram ProMaster',
      type: 'Van',
      maxLoadCapacity: 1200,
      odometer: 45000,
      acquisitionCost: 38000,
      status: 'IN_SHOP'
    }
  });

  console.log('Seeding Drivers...');
  const d1 = await prisma.driver.create({
    data: {
      name: 'Alex Johnson',
      licenseNumber: 'DL-111111',
      licenseCategory: 'LMV',
      licenseExpiryDate: new Date('2028-12-31'),
      contactNumber: '+1 555-0101',
      safetyScore: 98,
      status: 'AVAILABLE'
    }
  });

  const d2 = await prisma.driver.create({
    data: {
      name: 'Sam Smith',
      licenseNumber: 'DL-222222',
      licenseCategory: 'HMV',
      licenseExpiryDate: new Date('2027-10-15'),
      contactNumber: '+1 555-0102',
      safetyScore: 100,
      status: 'AVAILABLE'
    }
  });

  const d3 = await prisma.driver.create({
    data: {
      name: 'Test DRIVER', // Important so the DRIVER user profile matches
      licenseNumber: 'DL-333333',
      licenseCategory: 'CDL',
      licenseExpiryDate: new Date('2029-01-01'),
      contactNumber: '+1 555-0103',
      safetyScore: 95,
      status: 'AVAILABLE'
    }
  });

  console.log('Seeding Trips...');
  await prisma.trip.create({
    data: {
      source: 'Warehouse A',
      destination: 'Store 12',
      cargoWeight: 800,
      plannedDistance: 45.5,
      status: 'DRAFT',
      vehicleId: v1.id,
      driverId: d1.id
    }
  });

  await prisma.trip.create({
    data: {
      source: 'Distribution Center',
      destination: 'Client HQ',
      cargoWeight: 2000,
      plannedDistance: 120,
      actualDistance: 125,
      fuelConsumed: 18.5,
      revenue: 450.00,
      status: 'COMPLETED',
      dispatchedAt: new Date(Date.now() - 86400000), // yesterday
      completedAt: new Date(Date.now() - 43200000),
      vehicleId: v2.id,
      driverId: d2.id
    }
  });

  console.log('Seeding Maintenance Logs...');
  await prisma.maintenanceLog.create({
    data: {
      description: 'Regular oil change and tire rotation',
      cost: 150.00,
      status: 'CLOSED',
      openedAt: new Date(Date.now() - 5 * 86400000),
      closedAt: new Date(Date.now() - 4 * 86400000),
      vehicleId: v1.id
    }
  });

  await prisma.maintenanceLog.create({
    data: {
      description: 'Engine knocking noise - requires inspection',
      cost: 0, // Pending
      status: 'OPEN',
      vehicleId: v3.id
    }
  });

  console.log('Seeding Expenses & Fuel...');
  await prisma.fuelLog.create({
    data: {
      liters: 45.5,
      cost: 65.20,
      vehicleId: v1.id
    }
  });

  await prisma.expense.create({
    data: {
      type: 'TOLL',
      amount: 15.50,
      vehicleId: v2.id
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
