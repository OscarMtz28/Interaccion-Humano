import React from "react";
import { History as HistoryIcon, Trash2, Calendar, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MedicationHistory } from "../types";

interface HistoryProps {
  history: MedicationHistory[];
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onClear }) => {
  // agrupar historial por fecha (día)
  const groupedHistory = history.reduce(
    (acc, record) => {
      const dateStr = record.takenAt.split("T")[0];
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(record);
      return acc;
    },
    {} as Record<string, MedicationHistory[]>,
  );

  const sortedDates = Object.keys(groupedHistory).sort((a, b) =>
    b.localeCompare(a),
  ); // desc

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-blue-500" />
            Historial
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Registro de todas tus tomas confirmadas
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-slate-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Aún no hay historial
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Tus medicamentos tomados aparecerán aquí para llevar un registro.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize flex items-center gap-2 px-1 opacity-80">
                <Calendar className="w-4 h-4" />
                {formatDate(date)}
              </h2>

              <div className="space-y-3">
                <AnimatePresence>
                  {groupedHistory[date]
                    .sort((a, b) => b.takenAt.localeCompare(a.takenAt))
                    .map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center gap-4 shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            {record.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {record.dosage}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                            {formatTime(record.takenAt)}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Prog: {record.scheduledTime}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
