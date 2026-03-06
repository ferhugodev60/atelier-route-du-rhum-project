/*
  Warnings:

  - You are about to drop the column `userId` on the `GiftCard` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GiftCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "balance" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);
INSERT INTO "new_GiftCard" ("amount", "balance", "code", "createdAt", "expiresAt", "id", "status") SELECT "amount", "balance", "code", "createdAt", "expiresAt", "id", "status" FROM "GiftCard";
DROP TABLE "GiftCard";
ALTER TABLE "new_GiftCard" RENAME TO "GiftCard";
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
