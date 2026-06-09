import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const hashed = await bcrypt.hash("123456", 10);

    await prisma.user.create({
        data: {
            email: "psicologa@institucion.gob",
            name: "Psicologa",
            password: hashed,
            role: "PSYCHOLOGIST"
        }
    });

    console.log("Usuario creado exitosamente");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });