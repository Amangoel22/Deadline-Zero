import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getRoutine,
  saveRoutine as saveRoutineApi,
} from '../lib/routine.service';

export interface Commitment {
  title: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

export interface Routine {
  wakeTime: string;
  sleepTime: string;
  preferredWorkStart?: string;
  preferredWorkEnd?: string;
  timezone: string;
  commitments: Commitment[];
}

interface RoutineContextType {
  routine: Routine | null;
  saveRoutine: (routine: Routine) => Promise<void>;
  fetchRoutine: () => Promise<void>;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [routine, setRoutine] = useState<Routine | null>(null);

  const fetchRoutine = async () => {
    try {
      const data = await getRoutine();
      setRoutine(data);
    } catch (error) {
      console.error('Failed to fetch routine:', error);
    }
  };

  const saveRoutine = async (routineData: Routine) => {
    try {
      const savedRoutine = await saveRoutineApi(routineData);
      setRoutine(savedRoutine);
    } catch (error) {
      console.error('Failed to save routine:', error);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, []);

  return (
    <RoutineContext.Provider
      value={{
        routine,
        saveRoutine,
        fetchRoutine,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);

  if (!context) {
    throw new Error('useRoutine must be used within RoutineProvider');
  }

  return context;
}