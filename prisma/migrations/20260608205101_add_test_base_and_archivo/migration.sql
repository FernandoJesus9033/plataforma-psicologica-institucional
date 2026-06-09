-- CreateTable
CREATE TABLE "TestBase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "archivoUrl" TEXT NOT NULL,
    "archivoNombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
