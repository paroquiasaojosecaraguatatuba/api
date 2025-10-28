import type { CalendarSchedule } from '@/entities/calendar-schedule';
import type { Community } from '@/entities/community';
import type { CommunitiesDAF } from '@/services/database/communities-daf';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';
import moment from 'moment';

interface ListCalendarRequest {
  month: number;
}

export class ListCalendar {
  constructor(
    private massSchedulesDaf: MassSchedulesDAF,
    private communitiesDaf: CommunitiesDAF,
  ) {}

  async execute({ month }: ListCalendarRequest) {
    const firstDayOfMonth = moment()
      .month(month - 1)
      .startOf('month')
      .get('date');
    const lastDayOfMonth = moment()
      .month(month - 1)
      .endOf('month')
      .get('date');

    const communities = await this.communitiesDaf.findAll();

    const massSchedules = await this.massSchedulesDaf.findAll();

    let calendar: CalendarSchedule[] = [];

    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day++) {
      const date = moment()
        .month(month - 1)
        .date(day)
        .format('YYYY-MM-DD');

      const weekday = moment(date).weekday();

      let massSchedulesInDate = massSchedules.filter((schedule) => {
        if (!schedule.active) return;

        const scheduleStart = schedule.startDate
          ? moment(schedule.startDate)
          : null;

        const scheduleEnd = schedule.endDate ? moment(schedule.endDate) : null;

        const now = moment();

        if (!schedule.active) {
          return;
        }

        if (scheduleStart && now.isBefore(scheduleStart, 'month')) {
          return;
        }

        if (scheduleEnd && now.isAfter(scheduleEnd, 'month')) {
          return;
        }

        if (schedule.recurrenceType === 'yearly') {
          return schedule.monthOfYear === month && schedule.dayOfMonth === day;
        }

        if (schedule.recurrenceType === 'monthly') {
          // Para devoções do primeiro sábado/sexta
          if (schedule.dayOfWeek !== undefined && schedule.weekOfMonth === 1) {
            return isFirstWeekdayOfMonth(moment(date), schedule.dayOfWeek);
          }
          // Para dia fixo do mês
          return schedule.dayOfMonth === day;
        }

        if (schedule.recurrenceType === 'weekly') {
          return schedule.dayOfWeek === weekday;
        }
      });

      // Se houver solenidade, remove outros agendamentos da mesma data
      const hasSolemnity = massSchedulesInDate.some(
        (s) => s.type === 'solemnity',
      );
      if (hasSolemnity) {
        massSchedulesInDate = massSchedulesInDate.filter(
          (s) => s.type === 'solemnity',
        );
      }

      // Se missa devocional cai em um domingo, remove ela e prevalece a liturgia de domingo
      const isSunday = weekday === 0;
      if (isSunday) {
        massSchedulesInDate = massSchedulesInDate.filter(
          (s) => s.type !== 'devotional',
        );
      }

      // Se missa devocional cai em dia ordinário, remove outros agendamentos e prevalece a devocional
      const hasDevotional = massSchedulesInDate.some(
        (s) => s.type === 'devotional',
      );
      if (hasDevotional) {
        massSchedulesInDate = massSchedulesInDate.filter(
          (s) => s.type === 'devotional',
        );
      }

      const priorityTypes = ['solemnity', 'devotional', 'ordinary'];

      calendar.push({
        date,
        dayOfWeek: moment(date).weekday(),
        dayOfWeekLabel: moment(date).format('dddd'),
        schedules: massSchedulesInDate
          .sort(
            (a, b) =>
              priorityTypes.indexOf(a.type) - priorityTypes.indexOf(b.type),
          )
          .flatMap((schedule) => {
            const community = communities.find(
              (c) => c.id === schedule.communityId,
            ) as Community;

            return schedule.times.map((time) => ({
              type: 'mass' as const,
              title: schedule.title,
              massType: schedule.type,
              orientations: schedule.orientations,
              isPrecept: schedule.isPrecept,
              startTime: time.startTime,
              endTime: time.endTime,
              community: {
                id: schedule.communityId,
                name: community.name,
                address: community.address,
              },
            }));
          }),
      });
    }

    calendar = calendar.map((day) => ({
      ...day,
      schedules: day.schedules.sort((a, b) => {
        const aFirstTime = a.startTime.split(':').map(Number);
        const bFirstTime = b.startTime.split(':').map(Number);

        if (aFirstTime[0] === bFirstTime[0]) {
          return aFirstTime[1] - bFirstTime[1];
        }

        return aFirstTime[0] - bFirstTime[0];
      }),
    }));

    return { calendar };
  }
}

function getFirstWeekdayOfMonth(month: number, year: number, weekday: number) {
  const date = moment({ year, month: month - 1, day: 1 });
  while (date.weekday() !== weekday) {
    date.add(1, 'day');
  }
  return date;
}

function isFirstWeekdayOfMonth(date: moment.Moment, weekday: number) {
  const firstWeekday = getFirstWeekdayOfMonth(
    date.month() + 1,
    date.year(),
    weekday,
  );
  return date.isSame(firstWeekday, 'day');
}
