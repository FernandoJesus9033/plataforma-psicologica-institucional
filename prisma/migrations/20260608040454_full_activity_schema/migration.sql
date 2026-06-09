/*
  Warnings:

  - You are about to drop the column `feedback` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Activity` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "calificacion" INTEGER,
    "comentario" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "entregaUrl" TEXT,
    "entregaNombre" TEXT,
    "entregaTipo" TEXT,
    "entregadoEn" DATETIME,
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "studentId" TEXT NOT NULL,
    "psychologistId" TEXT NOT NULL,
    CONSTRAINT "Activity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("createdAt", "description", "dueDate", "fileName", "fileType", "fileUrl", "id", "psychologistId", "status", "studentId", "title", "updatedAt") SELECT "createdAt", "description", "dueDate", "fileName", "fileType", "fileUrl", "id", "psychologistId", "status", "studentId", "title", "updatedAt" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" DATETIME,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpires" DATETIME
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "name", "password", "resetToken", "resetTokenExpires", "role", "verificationToken") SELECT "createdAt", "email", "emailVerified", "id", "name", "password", "resetToken", "resetTokenExpires", "role", "verificationToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
