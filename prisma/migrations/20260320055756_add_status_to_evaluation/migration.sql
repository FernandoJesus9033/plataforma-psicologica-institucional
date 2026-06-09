/*
  Warnings:

  - Added the required column `status` to the `evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_evaluations" ("createdAt", "id", "score", "studentId") SELECT "createdAt", "id", "score", "studentId" FROM "evaluations";
DROP TABLE "evaluations";
ALTER TABLE "new_evaluations" RENAME TO "evaluations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
