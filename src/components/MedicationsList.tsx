import React from "react";
import { Pill, Trash2, CalendarHeart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Medication } from "../types";

interface MedicationsListProps {
  medications: Medication[];
  onDeleteTreatment: (name: string) => void;
}

export const MedicationsList: React.FC<MedicationsListProps> = ({
  medications,
  onDeleteTreatment,
}) => {
  // agrupar medicamentos por nombre (tratamiento)
  const groupedMeds = medications.reduce(
    (acc, med) => {
      const groupName = med.name.trim().toUpperCase();
      if (!acc[groupName]) {
        acc[groupName] = {
          name: med.name,
          dosage: med.dosage,
          times: [],
          notes: med.notes,
        };
      }
      acc[groupName].times.push(med.time);
      return acc;
    },
    {} as Record<
      string,
      { name: string; dosage: string; times: string[]; notes?: string }
    >,
  );

  const treatments = Object.values(groupedMeds).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <CalendarHeart className="w-8 h-8 text-blue-500" />
          Mis Tratamientos
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Gestiona los medicamentos que tienes registrados.
        </p>
      </header>

      {treatments.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="text-slate-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Sin tratamientos
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Aún no has agregado ningún medicamento a tu rutina diaria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {treatments.map((treatment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl border bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm relative overflow-hidden group"
              >
                <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-blue-500"></div>
                <div className="flex items-start sm:items-center gap-4 pl-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                      {treatment.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {treatment.dosage}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-1 items-center">
                      <span className="opacity-70">Horas: </span>
                      {treatment.times.sort().map((time) => (
                        <span
                          key={time}
                          className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md font-bold text-[10px] text-slate-700 dark:text-slate-300"
                        >
                          {time}
                        </span>
                      ))}
                    </p>
                    {treatment.notes && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic flex items-start">
                        <span className="mr-1">↳</span> {treatment.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => onDeleteTreatment(treatment.name)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-500 dark:hover:bg-red-900/30 rounded-xl transition-colors font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
