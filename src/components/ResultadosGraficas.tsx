"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Legend
} from "recharts";

interface ResultadosGraficasProps {
  datosRadar: { subject: string; value: number; fullMark: number }[];
  datosBarras: { escala: string; puntaje: number; color: string }[];
}

export default function ResultadosGraficas({ datosRadar, datosBarras }: ResultadosGraficasProps) {
  return (
    <>
      {/* Gráfica de Radar */}
      <div style={{ height: "400px", width: "100%", marginBottom: "2rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={datosRadar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 28]} tickCount={7} />
            <Radar name="Puntaje" dataKey="value" stroke="#4a90c4" fill="#4a90c4" fillOpacity={0.5} />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Barras */}
      <div style={{ height: "400px", width: "100%", marginBottom: "1rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosBarras} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="escala" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 28]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="puntaje" name="Puntaje" radius={[8, 8, 0, 0]}>
              {datosBarras.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}