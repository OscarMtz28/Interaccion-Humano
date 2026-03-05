export type MedicationStatus = 'pending' | 'taken' | 'postponed';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm format
  status: MedicationStatus;
  lastUpdatedDate: string; // YYYY-MM-DD
  notes?: string;
}
