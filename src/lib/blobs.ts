// src/lib/blobs.ts
import { getStore } from "@netlify/blobs";

export async function getCitasStore() {
  return getStore("citas");
}

export interface Cita {
  id: string;
  studentEmail: string;
  studentName: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";
  createdAt: string;
}

export async function guardarCita(cita: Cita) {
  const store = await getCitasStore();
  await store.setJSON(cita.id, cita);
  return cita;
}

export async function obtenerCitasPorEstudiante(email: string) {
  const store = await getCitasStore();
  const citas: Cita[] = [];
  for await (const item of store.list()) {
    const cita = await store.get(item.key);
    if (cita) {
      const parsed = JSON.parse(cita);
      if (parsed.studentEmail === email) {
        citas.push(parsed);
      }
    }
  }
  return citas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export async function cancelarCita(id: string) {
  const store = await getCitasStore();
  const cita = await store.get(id);
  if (cita) {
    const parsed = JSON.parse(cita);
    parsed.estado = "CANCELADA";
    await store.setJSON(id, parsed);
    return parsed;
  }
  return null;
}