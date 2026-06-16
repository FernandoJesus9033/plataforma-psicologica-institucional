FROM node:20-alpine AS base

# Instalar openssl para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Crear directorio para archivos subidos
RUN mkdir -p /app/uploads

# Comando para correr la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]