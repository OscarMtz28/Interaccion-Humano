import React, { useState } from "react";
import type { Medication } from "../types";
import { CheckCircle2, Pill, Clock } from "lucide-react";

interface AddMedicationProps {
  onAdd: (
    medication: Omit<Medication, "id" | "status" | "lastUpdatedDate">,
  ) => void;
}

const COMMON_MEDS = [
  "Paracetamol",
  "Ibuprofeno",
  "Aspirina",
  "Omeprazol",
  "Loratadina",
  "Amoxicilina",
];
const DOSAGE_UNITS = ["pastilla(s)", "gotas", "mg", "g", "ml", "cápsula(s)"];

export const AddMedication: React.FC<AddMedicationProps> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState(DOSAGE_UNITS[0]);
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState<"once" | "interval">("once");
  const [intervalHours, setIntervalHours] = useState("8");
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !time) return;

    const fullDosage = `${amount} ${unit}`;

    if (frequency === "once") {
      onAdd({ name, dosage: fullDosage, time, notes });
    } else {
      // Calculate multiple times
      const timesToGenerate = Math.floor(24 / Number(intervalHours));
      const [startH, startM] = time.split(":").map(Number);

      for (let i = 0; i < timesToGenerate; i++) {
        const nextH = (startH + Number(intervalHours) * i) % 24;
        const formattedTime = `${String(nextH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`;
        onAdd({ name, dosage: fullDosage, time: formattedTime, notes });
      }
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setName("");
      setAmount("1");
      setTime("");
      setNotes("");
    }, 1500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Nuevo Medicamento
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Registra un nuevo medicamento, dosis e intervalos.
        </p>
      </header>

      {showSuccess ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-100 text-green-500 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ¡Guardado con Éxito!
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Tus recordatorios han sido programados.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nombre y Precargar */}
          <div className="space-y-3">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              ¿Qué medicamento vas a tomar?
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_MEDS.map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => setName(med)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    name === med
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {med}
                </button>
              ))}
            </div>
            <div className="relative">
              <Pill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del medicamento"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Dosis y Unidades */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Dosis (Cantidad y Unidad)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-1/3 px-4 py-4 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold"
                required
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-2/3 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium appearance-none"
              >
                {DOSAGE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Frecuencia y Horario */}
          <div className="space-y-3 bg-blue-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-blue-100 dark:border-slate-700/50">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Frecuencia y Horario
            </label>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setFrequency("once")}
                className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all focus:outline-none ${
                  frequency === "once"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                1 vez al día
              </button>
              <button
                type="button"
                onClick={() => setFrequency("interval")}
                className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all focus:outline-none ${
                  frequency === "interval"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                Cada ciertas horas
              </button>
            </div>

            {frequency === "interval" && (
              <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Repetir cada
                </span>
                <select
                  value={intervalHours}
                  onChange={(e) => setIntervalHours(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-bold text-center"
                >
                  <option value="4">4 horas</option>
                  <option value="6">6 horas</option>
                  <option value="8">8 horas</option>
                  <option value="12">12 horas</option>
                  <option value="24">24 horas</option>
                </select>
              </div>
            )}

            <div className="relative mt-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                {frequency === "once"
                  ? "Hora de la toma"
                  : "Primera toma a las"}
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 pointer-events-none" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-2xl font-bold transition-all shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notas Adicionales */}
          <div className="space-y-3">
            <label
              htmlFor="notes"
              className="block text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              Notas Adicionales (Opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ejemplo: caja amarilla, con mucha agua"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 resize-none text-md"
            />
          </div>

          <div className="pt-4 pb-8">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-[0.98] transition-all text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/30 ring-1 ring-inset ring-black/10 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6" />
              Guardar Medicamento
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
