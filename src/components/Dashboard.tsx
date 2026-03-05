import React, { useState } from "react";
import { Check, Clock, Pill, ChevronDown, ChevronUp, Undo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Medication } from "../types";

interface DashboardProps {
  data: {
    medications: Medication[];
    updateStatus: (id: string, status: Medication["status"]) => void;
    postponeMedication: (id: string, minutes?: number) => void;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { medications, updateStatus, postponeMedication } = data;
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const todayStr = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Sort by time
  const sortedMeds = [...medications].sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  // Separate into Taken and Active
  const activeMeds = sortedMeds.filter((med) => med.status !== "taken");
  const takenMeds = sortedMeds.filter((med) => med.status === "taken");

  // Group active meds by Name
  const groupedActiveMeds = activeMeds.reduce(
    (acc, med) => {
      const groupName = med.name.trim().toUpperCase();
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(med);
      return acc;
    },
    {} as Record<string, Medication[]>,
  );

  const groupOrder = Object.keys(groupedActiveMeds).sort();

  return (
    <div className="p-4 sm:p-6 pb-28 max-w-2xl mx-auto w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          Control Diario
        </h1>
        <p className="text-slate-500 dark:text-slate-400 capitalize">
          {todayStr}
        </p>
      </header>

      {medications.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="text-blue-500 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Tu día está libre
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            No tienes medicamentos programados para hoy.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Medications grouped by Name */}
          <div className="space-y-4">
            {groupOrder.map((groupKey) => {
              const medsInGroup = groupedActiveMeds[groupKey];
              if (!medsInGroup || medsInGroup.length === 0) return null;

              const displayTitle =
                medsInGroup[0].name.charAt(0).toUpperCase() +
                medsInGroup[0].name.slice(1);
              const isExpanded = expandedGroups[groupKey] !== false; // por defecto expandido

              const postponedCount = medsInGroup.filter(
                (m) => m.status === "postponed",
              ).length;

              return (
                <div
                  key={groupKey}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden"
                >
                  {/* ACCORDION HEADER */}
                  <button
                    onClick={() => toggleGroup(groupKey)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                          {displayTitle}
                        </h2>
                        <div className="flex gap-2 text-xs font-semibold mt-0.5">
                          <span className="text-slate-500 dark:text-slate-400">
                            {medsInGroup.length} tomas pendientes
                          </span>
                          {postponedCount > 0 && (
                            <span className="text-orange-500">
                              ({postponedCount} pospuestas)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  {/* ACCORDION BODY */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
                      >
                        <div className="p-3 space-y-3 bg-slate-50/30 dark:bg-slate-900/10">
                          {medsInGroup.map((med) => (
                            <div
                              key={med.id}
                              className="p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 relative overflow-hidden group shadow-sm shadow-slate-100/50 dark:shadow-none"
                            >
                              {/* Color accent line on the left */}
                              <div
                                className={`absolute left-0 top-0 bottom-0 w-1 ${med.status === "postponed" ? "bg-orange-400" : "bg-blue-500"}`}
                              ></div>

                              <div className="flex justify-between items-start mb-3 pl-2">
                                <div>
                                  <p className="text-slate-700 dark:text-slate-200 font-bold text-sm">
                                    Dosis: {med.dosage}
                                  </p>
                                  {med.notes && (
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 italic flex items-start">
                                      <span className="mr-1">↳</span>{" "}
                                      {med.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <span
                                    className={`text-xl font-black tracking-tight ${
                                      med.status === "postponed"
                                        ? "text-orange-500 dark:text-orange-400"
                                        : "text-slate-900 dark:text-white"
                                    }`}
                                  >
                                    {med.time}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-700/50 pl-2">
                                <button
                                  onClick={() => updateStatus(med.id, "taken")}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-lg font-bold text-sm transition-all"
                                >
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                  Tomar
                                </button>

                                <button
                                  onClick={() => postponeMedication(med.id, 30)}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg font-semibold text-sm transition-all"
                                >
                                  <Clock className="w-4 h-4" />
                                  Posp.
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Taken Medications Section */}
          {takenMeds.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 px-1 opacity-70">
                <Check className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-bold text-slate-600 dark:text-slate-400">
                  Completados hoy
                </h2>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                  {takenMeds.length}
                </span>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {takenMeds.map((med) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 0.8, height: "auto" }}
                      className="p-3 sm:p-4 rounded-2xl border bg-slate-50 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/50 flex flex-col group hover:opacity-100 transition-opacity relative"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300 line-through decoration-slate-400">
                              {med.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {med.dosage} • a las {med.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {/* Botón de revertir/deshacer */}
                          <button
                            onClick={() => updateStatus(med.id, "pending")}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1"
                            title="Revertir (Marcar como no tomado)"
                          >
                            <Undo className="w-4 h-4" />
                            <span className="text-[10px] font-bold hidden sm:inline">
                              Deshacer
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
