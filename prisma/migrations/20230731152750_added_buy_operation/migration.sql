-- CreateTable
CREATE TABLE "BuyOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CompositionBuyOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "buyOperationId" TEXT NOT NULL,
    CONSTRAINT "CompositionBuyOperation_buyOperationId_fkey" FOREIGN KEY ("buyOperationId") REFERENCES "BuyOperation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
