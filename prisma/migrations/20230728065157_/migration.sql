/*
  Warnings:

  - You are about to drop the column `componentId` on the `CompositionItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompositionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" REAL NOT NULL,
    "complectId" TEXT NOT NULL,
    CONSTRAINT "CompositionItem_complectId_fkey" FOREIGN KEY ("complectId") REFERENCES "Complect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompositionItem" ("article", "complectId", "count", "id", "name") SELECT "article", "complectId", "count", "id", "name" FROM "CompositionItem";
DROP TABLE "CompositionItem";
ALTER TABLE "new_CompositionItem" RENAME TO "CompositionItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
