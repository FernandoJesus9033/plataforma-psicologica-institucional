# 🧠 Plataforma Psicológica Institucional

Plataforma web para la gestión psicológica de estudiantes. Permite administrar alumnos, evaluaciones, citas, actividades y tests de personalidad (Gordon P-IPG).

---

## 🚀 Tecnologías

- **Next.js 16** (App Router)
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (con Docker)
- **NextAuth.js** (autenticación)
- **Docker** (contenedorización)
- **React** con **React Icons** y **Recharts** (gráficas)

---

## 📋 Funcionalidades

### Para Psicólogos
- Gestión de alumnos (CRUD)
- Creación y calificación de actividades
- Evaluaciones psicológicas
- Agenda de citas
- Resultados de tests (Gordon P-IPG)
- Estadísticas y gráficas

### Para Estudiantes
- Realizar test de personalidad (Gordon P-IPG)
- Ver resultados del test
- Solicitar citas con psicólogo
- Ver actividades y evaluaciones asignadas

---

## 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/plataforma_psicologica"