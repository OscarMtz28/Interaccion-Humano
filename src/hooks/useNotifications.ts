import { useEffect, useRef } from 'react';
import type { Medication } from '../types';

export const useNotifications = (medications: Medication[]) => {
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      
      const todayStr = now.toISOString().split('T')[0];

      medications.forEach(med => {
        // Condition: state=pending, time matches, not already notified today for this exact time
        if (
          med.status === 'pending' &&
          med.time === currentTimeStr &&
          med.lastUpdatedDate === todayStr
        ) {
          const alertKey = `${med.id}-${currentTimeStr}-${todayStr}`;
          
          if (!notifiedIdsRef.current.has(alertKey)) {
            // Trigger Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('¡Hora de tu medicamento!', {
                body: `Es hora de tomar: ${med.name} - ${med.dosage}`,
                icon: '/vite.svg', // Default icon for now
              });
            } else {
              // Fallback if no permissions
              alert(`¡Recordatorio Médico!\nEs hora de tomar: ${med.name}\nDosis: ${med.dosage}`);
            }

            notifiedIdsRef.current.add(alertKey);
          }
        }
      });
    };

    // Check every 10 seconds
    const intervalId = setInterval(checkAlerts, 10000);
    // Initial check
    checkAlerts();

    return () => clearInterval(intervalId);
  }, [medications]);
};
