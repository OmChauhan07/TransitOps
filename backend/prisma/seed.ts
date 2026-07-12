import { Role, VehicleStatus, DriverStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
const { prisma } = require('../src/config/database');

async function main() {
  const users = [
    { email: 'fleet.manager@demo.com', name: 'Fleet Manager Demo', role: 'FLEET_MANAGER' },
    { email: 'driver@demo.com', name: 'Driver Demo', role: 'DRIVER' },
    { email: 'safety.officer@demo.com', name: 'Safety Officer Demo', role: 'SAFETY_OFFICER' },
    { email: 'financial.analyst@demo.com', name: 'Financial Analyst Demo', role: 'FINANCIAL_ANALYST' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash('Demo@1234', 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, name: u.name },
      create: { ...u, password: hashed, isVerified: true }, // isVerified: true skips OTP for seeded demo users only
    });
  }

  const van = await prisma.vehicle.upsert({
    where: { registrationNumber: 'VAN-05' },
    update: {},
    create: {
      registrationNumber: 'VAN-05',
      name: 'Van 05',
      type: 'Van',
      maxLoadCapacity: 500,
      acquisitionCost: 25000,
      status: 'AVAILABLE',
    },
  });

  await prisma.vehicle.upsert({
    where: { registrationNumber: 'TRK-12' },
    update: {},
    create: {
      registrationNumber: 'TRK-12',
      name: 'Truck 12',
      type: 'Truck',
      maxLoadCapacity: 2000,
      acquisitionCost: 60000,
      status: 'AVAILABLE',
    },
  });

  await prisma.driver.upsert({
    where: { licenseNumber: 'DL-ALEX-001' },
    update: {},
    create: {
      name: 'Alex',
      licenseNumber: 'DL-ALEX-001',
      licenseCategory: 'LMV',
      licenseExpiryDate: new Date('2028-01-01'),
      contactNumber: '+91-9000000000',
      status: 'AVAILABLE',
    },
  });

  console.log('Seed complete:', { van });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
