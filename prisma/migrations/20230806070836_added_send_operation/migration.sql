-- CreateTable
CREATE TABLE "SendOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sendingData" TEXT NOT NULL,
    "isPacked" BOOLEAN NOT NULL DEFAULT false,
    "isSended" BOOLEAN NOT NULL DEFAULT false,
    "warehous" TEXT NOT NULL,
    "sendNumberMP" TEXT,
    "invoiceNumber" TEXT,
    "partCount" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "acceptDate" TEXT NOT NULL,
    "isAgreed" BOOLEAN NOT NULL DEFAULT false,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "SendOperationCompositionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "complectName" TEXT NOT NULL,
    "complectArticle" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "sendOperationId" TEXT NOT NULL,
    "complectId" TEXT NOT NULL,
    CONSTRAINT "SendOperationCompositionItem_sendOperationId_fkey" FOREIGN KEY ("sendOperationId") REFERENCES "SendOperation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SendOperationCompositionItem_complectId_fkey" FOREIGN KEY ("complectId") REFERENCES "Complect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
