export type CalendarSchedule = {
  date: string;
  dayOfWeek: number;
  dayOfWeekLabel: string;
  schedules: {
    type: 'mass' | 'event';
    title?: string;
    massType?: 'ordinary' | 'devotional' | 'solemnity';
    orientations?: string;
    isPrecept: boolean;
    startTime: string;
    endTime: string;
    community: {
      id: string;
      name: string;
      address: string;
    };
  }[];
};
