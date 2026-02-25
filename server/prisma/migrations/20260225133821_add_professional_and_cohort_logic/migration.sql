/*
  Warnings:

  - A unique constraint covering the columns `[siret]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "companyName" TEXT;
ALTER TABLE "User" ADD COLUMN "siret" TEXT;

-- CreateTable
CREATE TABLE "CompanyGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompanyGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "companyGroupId" TEXT,
    "workshopId" TEXT,
    "volumeId" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_companyGroupId_fkey" FOREIGN KEY ("companyGroupId") REFERENCES "CompanyGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "ProductVolume" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "orderId", "price", "quantity", "volumeId", "workshopId") SELECT "id", "orderId", "price", "quantity", "volumeId", "workshopId" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "memberCode" TEXT,
    "userId" TEXT,
    "companyGroupId" TEXT,
    "orderItemId" TEXT NOT NULL,
    CONSTRAINT "Participant_companyGroupId_fkey" FOREIGN KEY ("companyGroupId") REFERENCES "CompanyGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Participant_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("email", "firstName", "id", "lastName", "memberCode", "orderItemId", "phone", "userId") SELECT "email", "firstName", "id", "lastName", "memberCode", "orderItemId", "phone", "userId" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_siret_key" ON "User"("siret");
