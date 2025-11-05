type MassSchedule = {
  type: 'mass';
  title?: string;
  massType: 'ordinary' | 'devotional' | 'solemnity';
  orientations?: string;
  isPrecept: boolean;
  startTime: string;
  endTime: string;
  community: {
    id: string;
    name: string;
    address: string;
  };
};

type EventSchedule = {
  type: 'event';
  title: string;
  eventType:
    | 'mass'
    | 'pilgrimage'
    | 'service'
    | 'formation'
    | 'feast'
    | 'anniversary'
    | 'conference'
    | 'meeting'
    | 'celebration'
    | 'retreat'
    | 'liturgical_event'
    | 'ordination'
    | 'community_event'
    | 'other';
  customLocation?: string;
  orientations?: string;
  startTime: string;
  endTime?: string;
  community: {
    id: string;
    name: string;
    address: string;
  };
};

type Schedule = MassSchedule | EventSchedule;

export type CalendarSchedule = {
  date: string;
  dayOfWeek: number;
  dayOfWeekLabel: string;
  schedules: Schedule[];
};
