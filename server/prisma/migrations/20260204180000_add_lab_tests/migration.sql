-- CreateTable
CREATE TABLE "LabTests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "turnaroundTime" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "LabTests_code_key" ON "LabTests"("code");