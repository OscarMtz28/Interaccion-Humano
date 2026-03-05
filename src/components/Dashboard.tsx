import React from "react";
import { Check, Clock, Trash2, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Medication } from "../types";

interface DashboardProps {
  data: {
    medications: Medication[];
    updateStatus: (id: string, status: Medication["status"]) => void;
    postponeMedication: (id: string, minutes?: number) => void;
    deleteMedication: (id: string) => void;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { medications, updateStatus, postponeMedication, deleteMedication } =
    data;

  const todayStr = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Sort by time
  const sortedMedications = [...medications].sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Control Médico
        </h1>
        <p className="text-slate-500 dark:text-slate-400 capitalize">
          {todayStr}
        </p>
      </header>

      <div className="space-y-4">
        {sortedMedications.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="text-blue-500 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No hay medicamentos
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Agrega tus medicamentos usando el botón en la barra inferior.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {sortedMedications.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
                className={`p-5 rounded-2xl shadow-sm border transition-shadow hover:shadow-md
                  ${
                    med.status === "taken"
                      ? "bg-slate-50/50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-700 opacity-60"
                      : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl flex items-center justify-center
                      ${
                        med.status === "taken"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                      }`}
                    >
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-lg ${med.status === "taken" ? "line-through text-slate-500" : "text-slate-900 dark:text-white"}`}
                      >
                        {med.name}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium">
                        {med.dosage}
                      </p>
                      {med.notes && (
                        <p className="text-slate-400 text-xs mt-1 italic leading-tight">
                          Nota: {med.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xl font-bold ${med.status === "taken" ? "text-slate-400" : "text-blue-600 dark:text-blue-400"}`}
                    >
                      {med.time}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">
                      {med.status === "taken"
                        ? "Completado"
                        : med.status === "postponed"
                          ? "Pospuesto"
                          : "Pendiente"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  {med.status !== "taken" && (
                    <>
                      <button
                        onClick={() => updateStatus(med.id, "taken")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
                      >
                        <Check className="w-4 h-4" />
                        Tomado
                      </button>

                      <button
                        onClick={() => postponeMedication(med.id, 30)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-xl font-medium transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        +30 min
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      if (
                        window.confirm(`¿Estás seguro de eliminar ${med.name}?`)
                      ) {
                        deleteMedication(med.id);
                      }
                    }}
                    className={`flex items-center justify-center p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors ${med.status === "taken" ? "ml-auto" : ""}`}
                    title="Eliminar medicamento"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
