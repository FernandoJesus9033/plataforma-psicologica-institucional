import { getStore } from "@netlify/blobs";

export async function obtenerCitasPorEstudiante(email: string) {
  const store = getStore("citas");
  const citas: any[] = [];

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

export async function guardarCita(cita: any) {
  const store = getStore("citas");
  await store.setJSON(cita.id, cita);
  return cita;
}

export async function cancelarCita(id: string) {
  const store = getStore("citas");
  const cita = await store.get(id);
  if (cita) {
    const parsed = JSON.parse(cita);
    parsed.estado = "CANCELADA";
    await store.setJSON(id, parsed);
    return parsed;
  }
  return null;
}