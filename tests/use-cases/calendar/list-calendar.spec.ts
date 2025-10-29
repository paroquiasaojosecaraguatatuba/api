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
        id: '01K8PTP0X913WM25APCM8HVZ7M',
        communityId: communityParish.id,
        type: 'ordinary',
        active: true,
        recurrenceType: 'weekly',
        dayOfWeek: 5, // Thursday
        times: [
          {
            id: makeId(),
            scheduleId: '01K8PTP0X913WM25APCM8HVZ7M',
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
        isPrecept: true,
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
        isPrecept: true,
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
        isPrecept: true,
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

  it('should return schedules for first friday and first saturday of the month', async () => {
    const { calendar } = await sut.execute({ month: 1, year: 2025 });

    expect(calendar).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2025-01-03',
          dayOfWeek: 5,
          schedules: expect.arrayContaining([
            expect.objectContaining({
              type: 'mass',
              massType: 'devotional',
              title: 'Sagrado Coração de Jesus',
              community: expect.objectContaining({
                id: communitySacredHeart.id,
                name: communitySacredHeart.name,
                address: communitySacredHeart.address,
              }),
            }),
          ]),
        }),
        expect.objectContaining({
          date: '2025-01-04',
          dayOfWeek: 6,
          schedules: expect.arrayContaining([
            expect.objectContaining({
              type: 'mass',
              massType: 'devotional',
              title: 'Imaculado Coração de Maria',
              community: expect.objectContaining({
                id: communityParish.id,
                name: communityParish.name,
                address: communityParish.address,
              }),
            }),
          ]),
        }),
      ]),
    );
  });

  it('should prioritize Sunday Masses over devotional Masses', async () => {
    const { calendar } = await sut.execute({ month: 1, year: 2025 });

    expect(calendar).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2025-01-19',
          dayOfWeek: 0,
          schedules: expect.arrayContaining([
            expect.objectContaining({
              type: 'mass',
              massType: 'ordinary',
              startTime: '9:30',
              endTime: '10:30',
              community: expect.objectContaining({
                id: communityParish.id,
                name: communityParish.name,
                address: communityParish.address,
              }),
            }),
            expect.objectContaining({
              type: 'mass',
              massType: 'ordinary',
              startTime: '11:00',
              endTime: '12:00',
              community: expect.objectContaining({
                id: communitySacredHeart.id,
                name: communitySacredHeart.name,
                address: communitySacredHeart.address,
              }),
            }),
            expect.objectContaining({
              type: 'mass',
              massType: 'ordinary',
              startTime: '19:30',
              endTime: '20:30',
              community: expect.objectContaining({
                id: communityParish.id,
                name: communityParish.name,
                address: communityParish.address,
              }),
            }),
          ]),
        }),
      ]),
    );
  });

  it('should prioritize Solemnity Masses and cancel other schedules', async () => {
    const { calendar } = await sut.execute({ month: 3, year: 2025 });

    expect(calendar).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2025-03-19',
          dayOfWeek: 3, // Wednesday
          schedules: [
            expect.objectContaining({
              type: 'mass',
              massType: 'solemnity',
              title: 'São José',
              community: expect.objectContaining({
                id: communityParish.id,
                name: communityParish.name,
                address: communityParish.address,
              }),
            }),
          ],
        }),
      ]),
    );
  });

  it('should prioritize devotional Masses over regular schedules in same time', async () => {
    const { calendar } = await sut.execute({ month: 6, year: 2025 });

    expect(calendar).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2025-06-19',
          dayOfWeek: 4, // Thursday
          schedules: [
            expect.objectContaining({
              type: 'mass',
              massType: 'devotional',
              title: 'Padroeiro São José',
              community: expect.objectContaining({
                id: communityParish.id,
                name: communityParish.name,
                address: communityParish.address,
              }),
            }),
          ],
        }),
      ]),
    );
  });
});
