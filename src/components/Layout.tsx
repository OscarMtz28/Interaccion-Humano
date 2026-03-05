import React, { useState } from "react";
import { Home, PlusCircle } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { AddMedication } from "./AddMedication";
import { useMedications } from "../hooks/useMedications";
import { useNotifications } from "../hooks/useNotifications";
import type { Medication } from "../types";

export const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "add">("dashboard");
  const medicationData = useMedications();
  useNotifications(medicationData.medications);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === "dashboard" ? (
          <Dashboard data={medicationData} />
        ) : (
          <AddMedication
            onAdd={(
              med: Omit<Medication, "id" | "status" | "lastUpdatedDate">,
            ) => {
              medicationData.addMedication(med);
              setActiveTab("dashboard"); // Redirect to dashboard after adding
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 safe-area-pb shadow-[0_-4px_25px_rgba(0,0,0,0.08)] z-50">
        <div className="flex justify-around items-center h-[72px]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 ${
              activeTab === "dashboard"
                ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
            }`}
          >
            <Home
              className="w-7 h-7"
              strokeWidth={activeTab === "dashboard" ? 2.5 : 2}
            />
            <span className="text-[11px] uppercase tracking-wider">Inicio</span>
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 ${
              activeTab === "add"
                ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
            }`}
          >
            <PlusCircle
              className="w-7 h-7"
              strokeWidth={activeTab === "add" ? 2.5 : 2}
            />
            <span className="text-[11px] uppercase tracking-wider">
              Agregar
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};
