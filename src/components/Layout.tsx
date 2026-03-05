import React, { useState } from "react";
import { Home, PlusCircle, History as HistoryIcon, Pill } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { AddMedication } from "./AddMedication";
import { History } from "./History";
import { MedicationsList } from "./MedicationsList";
import { useMedications } from "../hooks/useMedications";
import { useNotifications } from "../hooks/useNotifications";
import type { Medication } from "../types";

export const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "medications" | "history" | "add"
  >("dashboard");
  const medicationData = useMedications();
  useNotifications(medicationData.medications);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === "dashboard" && <Dashboard data={medicationData} />}

        {activeTab === "medications" && (
          <MedicationsList
            medications={medicationData.medications}
            onDeleteTreatment={medicationData.deleteTreatment}
          />
        )}

        {activeTab === "history" && (
          <History
            history={medicationData.history}
            onClear={medicationData.clearHistory}
          />
        )}

        {activeTab === "add" && (
          <AddMedication
            onAdd={(
              med: Omit<Medication, "id" | "status" | "lastUpdatedDate">,
            ) => {
              medicationData.addMedication(med);
              setActiveTab("dashboard");
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 safe-area-pb shadow-[0_-4px_25px_rgba(0,0,0,0.08)] z-50">
        <div className="flex justify-around items-center h-[72px] px-1 sm:px-2">
          {/* HOME */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 sm:space-y-1.5 transition-all duration-300 ${
              activeTab === "dashboard"
                ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
            }`}
          >
            <Home
              className="w-5 h-5 sm:w-6 sm:h-6"
              strokeWidth={activeTab === "dashboard" ? 2.5 : 2}
            />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider">
              Inicio
            </span>
          </button>

          {/* MEDICATIONS */}
          <button
            onClick={() => setActiveTab("medications")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 sm:space-y-1.5 transition-all duration-300 ${
              activeTab === "medications"
                ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
            }`}
          >
            <Pill
              className="w-5 h-5 sm:w-6 sm:h-6"
              strokeWidth={activeTab === "medications" ? 2.5 : 2}
            />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider">
              Rutina
            </span>
          </button>

          {/* HISTORY */}
          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 sm:space-y-1.5 transition-all duration-300 ${
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
            }`}
          >
            <HistoryIcon
              className="w-5 h-5 sm:w-6 sm:h-6"
              strokeWidth={activeTab === "history" ? 2.5 : 2}
            />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider">
              Historial
            </span>
          </button>

          {/* ADD */}
          <button
            onClick={() => setActiveTab("add")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 sm:space-y-1.5 transition-all duration-300 ${
              activeTab === "add"
                ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
            }`}
          >
            <PlusCircle
              className="w-5 h-5 sm:w-6 sm:h-6"
              strokeWidth={activeTab === "add" ? 2.5 : 2}
            />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider">
              Agregar
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};
