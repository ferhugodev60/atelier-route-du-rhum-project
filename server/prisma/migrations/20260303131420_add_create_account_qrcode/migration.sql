-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validatedAt" DATETIME,
    "memberCode" TEXT,
    "userId" TEXT,
    "companyGroupId" TEXT,
    "orderItemId" TEXT NOT NULL,
    CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Participant_companyGroupId_fkey" FOREIGN KEY ("companyGroupId") REFERENCES "CompanyGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Participant_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("companyGroupId", "email", "firstName", "id", "isValidated", "lastName", "memberCode", "orderItemId", "phone", "userId", "validatedAt") SELECT "companyGroupId", "email", "firstName", "id", "isValidated", "lastName", "memberCode", "orderItemId", "phone", "userId", "validatedAt" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
