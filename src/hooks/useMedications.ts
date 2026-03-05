import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Medication, MedicationStatus, MedicationHistory } from '../types';

const STORAGE_KEY = 'medication_tracker_data';
const HISTORY_KEY = 'medication_tracker_history';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [history, setHistory] = useState<MedicationHistory[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Save to local storage whenever medications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Reset status to pending for a new day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let hasChanges = false;
    
    const updatedMedications = medications.map(med => {
      if (med.lastUpdatedDate !== today) {
        hasChanges = true;
        return {
          ...med,
          status: 'pending' as MedicationStatus,
          lastUpdatedDate: today,
        };
      }
      return med;
    });

    if (hasChanges) {
      setMedications(updatedMedications);
    }
  }, []); // Only run once on mount

  const addMedication = (medication: Omit<Medication, 'id' | 'status' | 'lastUpdatedDate'>) => {
    const newMed: Medication = {
      ...medication,
      id: uuidv4(),
      status: 'pending',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
    };
    setMedications(prev => [...prev, newMed]);
  };

  const updateStatus = (id: string, status: MedicationStatus) => {
    setMedications(meds =>
      meds.map(med => {
        if (med.id === id) {
          // Si cambia a "taken", registrar en el historial
          if (status === 'taken' && med.status !== 'taken') {
            const newHistoryRecord: MedicationHistory = {
              id: uuidv4(),
              medicationId: med.id,
              name: med.name,
              dosage: med.dosage,
              scheduledTime: med.time,
              takenAt: new Date().toISOString(),
            };
            setHistory(prev => [newHistoryRecord, ...prev]);
          }
          // Si cambia a "pending" (deshacer), eliminar el registro más reciente de este medicamento hoy
          if (status === 'pending' && med.status === 'taken') {
            const todayStr = new Date().toISOString().split('T')[0];
            setHistory(prev => {
              const newHistory = [...prev];
              const idx = newHistory.findIndex(h => h.medicationId === med.id && h.takenAt.startsWith(todayStr));
              if (idx !== -1) newHistory.splice(idx, 1);
              return newHistory;
            });
          }
          
          return { ...med, status };
        }
        return med;
      })
    );
  };

  const deleteTreatment = (name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el tratamiento completo de ${name}? Esto borrará todas las tomas programadas y es permanente.`)) {
      setMedications(meds => meds.filter(med => med.name.trim().toLowerCase() !== name.trim().toLowerCase()));
    }
  };
  
  const postponeMedication = (id: string, minutes: number = 30) => {
    setMedications(meds =>
      meds.map(med => {
        if (med.id === id) {
          const [hours, mins] = med.time.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, mins + minutes);
          const newTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          return { ...med, time: newTime, status: 'postponed' };
        }
        return med;
      })
    );
  };

  const clearHistory = () => {
    if (window.confirm("¿Eliminar todo el historial? Esto no afectará tus recordatorios diarios.")) {
      setHistory([]);
    }
  };

  return {
    medications,
    history,
    addMedication,
    updateStatus,
    deleteTreatment,
    postponeMedication,
    clearHistory
  };
};
