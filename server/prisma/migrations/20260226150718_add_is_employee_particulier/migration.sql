-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanyGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    "totalSlots" INTEGER NOT NULL DEFAULT 25,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompanyGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompanyGroup" ("createdAt", "currentLevel", "id", "name", "ownerId") SELECT "createdAt", "currentLevel", "id", "name", "ownerId" FROM "CompanyGroup";
DROP TABLE "CompanyGroup";
ALTER TABLE "new_CompanyGroup" RENAME TO "CompanyGroup";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isEmployee" BOOLEAN NOT NULL DEFAULT false,
    "memberCode" TEXT,
    "companyName" TEXT,
    "siret" TEXT,
    "conceptionLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("companyName", "conceptionLevel", "createdAt", "email", "firstName", "id", "lastName", "memberCode", "password", "phone", "role", "siret") SELECT "companyName", "conceptionLevel", "createdAt", "email", "firstName", "id", "lastName", "memberCode", "password", "phone", "role", "siret" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_memberCode_key" ON "User"("memberCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
