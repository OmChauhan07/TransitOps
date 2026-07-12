const { prisma } = require('../src/config/database');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Clearing existing data...');
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const roles = ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
  const password = await bcrypt.hash('password123', 10);

  for (const role of roles) {
    await prisma.user.create({
      data: {
        email: `${role.toLowerCase()}@transitops.com`,
        name: `Test ${role}`,
        password,
        role: role,
        isVerified: true,
      },
    });
  }

  console.log('Seeding Vehicles...');
  const v1 = await prisma.vehicle.create({
    data: {
      plateNumber: 'ABC-1234',
      make: 'Ford',
      model: 'Transit',
      year: 2023,
      capacity: 1500,
      status: 'AVAILABLE'
    }
  });

  const v2 = await prisma.vehicle.create({
    data: {
      plateNumber: 'XYZ-9876',
      make: 'Mercedes',
      model: 'Sprinter',
      year: 2022,
      capacity: 2500,
      status: 'AVAILABLE'
    }
  });

  console.log('Seeding Drivers...');
  await prisma.driver.create({
    data: {
      name: 'Alex Johnson',
      licenseNumber: 'DL-111111',
      licenseExpiry: new Date('2028-12-31'),
      status: 'AVAILABLE'
    }
  });

  await prisma.driver.create({
    data: {
      name: 'Sam Smith',
      licenseNumber: 'DL-222222',
      licenseExpiry: new Date('2027-10-15'),
      status: 'AVAILABLE'
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
