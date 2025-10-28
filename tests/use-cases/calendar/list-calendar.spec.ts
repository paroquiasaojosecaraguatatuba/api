import type { Community } from '@/entities/community';
import { ListCalendar } from '@/use-cases/calendar/list-calendar';
import { makeId } from '@/use-cases/factories/make-id';
import { InMemoryCommunitiesDAF } from '@tests/database/in-memory-communities-daf';
import { InMemoryMassSchedulesDAF } from '@tests/database/in-memory-mass-schedules-daf';
import { makeCommunity } from '@tests/factories/make-community';
import { makeMassSchedule } from '@tests/factories/make-mass-schedule';
import moment from 'moment';
import { beforeEach, describe, expect, it } from 'vitest';

let massSchedulesDaf: InMemoryMassSchedulesDAF;
let communitiesDaf: InMemoryCommunitiesDAF;
let sut: ListCalendar;

let communityParish: Community;
let communitySacredHeart: Community;

describe('List Calendar Use Case', () => {
  beforeEach(() => {
    massSchedulesDaf = new InMemoryMassSchedulesDAF();
    communitiesDaf = new InMemoryCommunitiesDAF();
    sut = new ListCalendar(massSchedulesDaf, communitiesDaf);

    communityParish = makeCommunity({
      name: 'Paróquia São José',
      address: 'Rua Principal, 123',
    });

    communitySacredHeart = makeCommunity({
      name: 'Sagrado Coração de Jesus',
      address: 'Avenida Central, 456',
    });

    communitiesDaf.communities.push(communityParish, communitySacredHeart);

    const massSchedules = [
      makeMassSchedule({
        id: '01K8M79EYSVFJEJZVRAEFVM6QD',
        communityId: communityParish.id,
        type: 'ordinary',
        active: true,
        recurrenceType: 'weekly',
        dayOfWeek: 4, // Wednesday
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M79EYSVFJEJZVRAEFVM6QD',
            startTime: '19:30',
            endTime: '20:30',
          },
        ],
      }),
      makeMassSchedule({
        id: '01K8M7GZSNKGNQE99PJJ197BHZ',
        communityId: communityParish.id,
        type: 'ordinary',
        active: true,
        recurrenceType: 'weekly',
        dayOfWeek: 0, // Sunday
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M7GZSNKGNQE99PJJ197BHZ',
            startTime: '9:30',
            endTime: '10:30',
          },
          {
            id: makeId(),
            scheduleId: '01K8M7GZSNKGNQE99PJJ197BHZ',
            startTime: '19:30',
            endTime: '20:30',
          },
        ],
      }),
      makeMassSchedule({
        id: '01K8M9V3CWPMSRJM008P88HTKK',
        communityId: communitySacredHeart.id,
        type: 'ordinary',
        active: true,
        recurrenceType: 'weekly',
        dayOfWeek: 0, // Sunday
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M9V3CWPMSRJM008P88HTKK',
            startTime: '11:00',
            endTime: '12:00',
          },
        ],
      }),
      makeMassSchedule({
        id: '01K8M7J2DCBSM5SAXS33PZNB5S',
        communityId: communityParish.id,
        type: 'devotional',
        title: 'Padroeiro São José',
        active: true,
        recurrenceType: 'monthly',
        dayOfMonth: 19,
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M7J2DCBSM5SAXS33PZNB5S',
            startTime: '19:30',
            endTime: '20:30',
          },
        ],
      }),
      makeMassSchedule({
        id: '01K8M7W6TPHMH3805PW53GWNQM',
        communityId: communityParish.id,
        type: 'solemnity',
        title: 'São José',
        active: true,
        recurrenceType: 'yearly',
        dayOfMonth: 19,
        monthOfYear: 3, // March
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M7W6TPHMH3805PW53GWNQM',
            startTime: '19:30',
            endTime: '20:30',
          },
        ],
      }),
      makeMassSchedule({
        id: '01K8M7MSRJABN7P072NCSGEEVW',
        communityId: communityParish.id,
        type: 'devotional',
        title: 'Imaculado Coração de Maria',
        active: true,
        recurrenceType: 'monthly',
        weekOfMonth: 1,
        dayOfWeek: 6, // Saturday
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M7MSRJABN7P072NCSGEEVW',
            startTime: '08:00',
            endTime: '09:00',
          },
        ],
      }),
      makeMassSchedule({
        id: '01K8M7PBAYX1AVKVQX0M5EKD5C',
        communityId: communitySacredHeart.id,
        type: 'devotional',
        title: 'Sagrado Coração de Jesus',
        active: true,
        recurrenceType: 'monthly',
        weekOfMonth: 1,
        dayOfWeek: 5, // Friday
        times: [
          {
            id: makeId(),
            scheduleId: '01K8M7PBAYX1AVKVQX0M5EKD5C',
            startTime: '08:00',
            endTime: '09:00',
          },
        ],
      }),
    ];

    massSchedulesDaf.massSchedules.push(...massSchedules);
  });

  it('should return a calendar with correct days for the month', async () => {
    const { calendar } = await sut.execute({ month: 6 });

    console.log(JSON.stringify(calendar, null, 2));
  });
});
