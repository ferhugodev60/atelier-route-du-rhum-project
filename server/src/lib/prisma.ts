import { PrismaClient } from '@prisma/client';

// On crée une instance unique pour tout le serveur
export const prisma = new PrismaClient();