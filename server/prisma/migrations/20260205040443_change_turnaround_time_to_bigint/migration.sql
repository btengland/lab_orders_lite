/*
  Warnings:

  - You are about to alter the column `turnaroundTime` on the `LabTests` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabTests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "turnaroundTime" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LabTests" ("code", "createdAt", "id", "name", "price", "turnaroundTime") SELECT "code", "createdAt", "id", "name", "price", "turnaroundTime" FROM "LabTests";
DROP TABLE "LabTests";
ALTER TABLE "new_LabTests" RENAME TO "LabTests";
CREATE UNIQUE INDEX "LabTests_code_key" ON "LabTests"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
