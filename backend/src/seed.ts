import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '../generated/prisma';

dotenv.config();

const prisma = new PrismaClient();

async function upsertUser(params: {
  name: string;
  username?: string;
  email?: string;
  password: string;
  role: Role;
  locationLat?: number;
  locationLng?: number;
  ip?: string;
}) {
  const { name, username, email, password, role, locationLat, locationLng, ip } = params;
  const passwordHash = await bcrypt.hash(password, 10);

  const data = { name, username, email, passwordHash, role, locationLat, locationLng, ip };

  let existing = null as null | { id: string };
  if (username) {
    existing = await prisma.user.findUnique({ where: { username } });
  } else if (email) {
    existing = await prisma.user.findUnique({ where: { email } });
  }

  if (existing) {
    if (username) {
      await prisma.user.update({ where: { username }, data });
    } else if (email) {
      await prisma.user.update({ where: { email }, data });
    }
    return existing.id;
  }

  const created = await prisma.user.create({ data });
  return created.id;
}

async function main() {
  // Super Admin
  await upsertUser({
    name: 'Ajay Singh',
    username: 'superadmin',
    email: 'super-admin@skyber.dev',
    password: '1234567890',
    role: 'SUPER_ADMIN' as Role,
    locationLat: 26.548429,
    locationLng: 80.226518,
    ip: '223.184.165.40'
  });

  // Government Official
  await upsertUser({
    name: 'Aditya Gaur',
    username: 'adigr0121',
    password: '1234567890',
    role: 'GOVERNMENT' as Role,
    locationLat: 26.548429,
    locationLng: 80.226518,
    ip: '192.168.1.1'
  });

  // Public User
  await upsertUser({
    name: 'fisherman',
    username: 'bhola123',
    password: '1234567890',
    role: 'PUBLIC' as Role,
    locationLat: 8.382704,
    locationLng: 76.503065,
    ip: '168.288.158.145'
  });

  // Developer User
  await upsertUser({
    name: 'ajay',
    username: 'developer',
    email: 'developer@skyber.dev',
    password: '1234567890',
    role: 'DEVELOPER' as Role,
    locationLat: 20.548429,
    locationLng: 55.226518,
    ip: '192.168.0.23'
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


