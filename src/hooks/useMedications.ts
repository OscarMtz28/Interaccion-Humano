import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Medication, MedicationStatus } from '../types';

const STORAGE_KEY = 'medication_tracker_data';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing medications from local storage:', e);
      }
    }
    return [];
  });

  // Save to local storage whenever medications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

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
      meds.map(med => (med.id === id ? { ...med, status } : med))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(meds => meds.filter(med => med.id !== id));
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

  return {
    medications,
    addMedication,
    updateStatus,
    deleteMedication,
    postponeMedication,
  };
};
