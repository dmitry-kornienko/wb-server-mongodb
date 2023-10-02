-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "desc" TEXT
);

-- CreateTable
CREATE TABLE "Complect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CompositionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "count" REAL NOT NULL,
    "complectId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    CONSTRAINT "CompositionItem_complectId_fkey" FOREIGN KEY ("complectId") REFERENCES "Complect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompositionItem_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
