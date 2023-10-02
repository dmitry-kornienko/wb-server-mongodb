-- CreateTable
CREATE TABLE "PackedOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "complectId" TEXT NOT NULL,
    CONSTRAINT "PackedOperation_complectId_fkey" FOREIGN KEY ("complectId") REFERENCES "Complect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
