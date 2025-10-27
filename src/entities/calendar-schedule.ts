export type CalendarSchedule = {
  date: string;
  schedules: {
    type: 'mass' | 'event';
    title?: string;
    massType?: 'ordinary' | 'devotional' | 'solemnity';
    orientations?: string;
    isPrecept: string;
    startTime: string;
    endTime: string;
    community: {
      id: string;
      title: string;
      address: string;
    };
  }[];
};
