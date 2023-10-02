-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "desc" TEXT
);
INSERT INTO "new_Component" ("article", "count", "desc", "id", "name", "price") SELECT "article", "count", "desc", "id", "name", "price" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
