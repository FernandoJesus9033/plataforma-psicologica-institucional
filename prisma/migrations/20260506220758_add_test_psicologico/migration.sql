-- CreateTable
CREATE TABLE "TestRespuesta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestRespuesta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "test_resultados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "escalaA" INTEGER NOT NULL,
    "escalaR" INTEGER NOT NULL,
    "escalaE" INTEGER NOT NULL,
    "escalaS" INTEGER NOT NULL,
    "escalaC" INTEGER NOT NULL,
    "escalaO" INTEGER NOT NULL,
    "escalaP" INTEGER NOT NULL,
    "escalaV" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "test_resultados_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TestRespuesta_userId_preguntaId_key" ON "TestRespuesta"("userId", "preguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "test_resultados_userId_key" ON "test_resultados"("userId");
