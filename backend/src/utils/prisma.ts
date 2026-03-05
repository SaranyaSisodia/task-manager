import { PrismaClient } from '@prisma/client';

// Singleton pattern: one shared Prisma instance across the whole app
// Prevents opening too many database connections
const prisma = new PrismaClient();

export default prisma;
