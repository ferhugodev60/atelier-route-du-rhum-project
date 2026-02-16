-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workshop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PARTICULIER',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "color" TEXT,
    "format" TEXT NOT NULL,
    "availability" TEXT,
    "quote" TEXT NOT NULL,
    "price" REAL NOT NULL
);
INSERT INTO "new_Workshop" ("availability", "color", "description", "format", "id", "image", "level", "price", "quote", "title") SELECT "availability", "color", "description", "format", "id", "image", "level", "price", "quote", "title" FROM "Workshop";
DROP TABLE "Workshop";
ALTER TABLE "new_Workshop" RENAME TO "Workshop";
CREATE UNIQUE INDEX "Workshop_level_type_key" ON "Workshop"("level", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
