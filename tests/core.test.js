const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildPeriodSummary,
  buildTrainingWeekSchedule,
  computeCardioMetrics,
  countDoneSets,
  createCardioEntry,
  findNextAvailableTrainingWeekday,
  getMonthRange,
  getShiftedMonthRange,
  normalizeTrainingWeekday,
  sortTrainingPlanDays,
  sumCardioDistance,
} = require('../js/core.js');

test('computeCardioMetrics returns pace and speed from real distance', () => {
  const metrics = computeCardioMetrics(30, 5);

  assert.equal(metrics.paceText, '6:00');
  assert.equal(metrics.speedText, '10.00');
  assert.equal(metrics.paceMinutesPerKm, 6);
});

test('computeCardioMetrics handles rounded seconds without producing invalid pace', () => {
  const metrics = computeCardioMetrics(20, 3);

  assert.equal(metrics.paceText, '6:40');
  assert.equal(metrics.speedText, '9.00');
});

test('createCardioEntry normalizes numeric fields and rounds distance', () => {
  const entry = createCardioEntry({
    id: 'c1',
    date: '2026-04-04',
    duration: '45',
    calories: '320',
    steps: '6012',
    heartRate: '128',
    distKm: '6.236',
  });

  assert.deepEqual(entry, {
    id: 'c1',
    date: '2026-04-04',
    duration: 45,
    calories: 320,
    steps: 6012,
    heartRate: 128,
    distKm: 6.24,
  });
});

test('sumCardioDistance falls back to step-based estimation only when distance is missing', () => {
  const distance = sumCardioDistance([
    { distKm: 3.5, steps: 1000 },
    { steps: 4000 },
  ]);

  assert.equal(distance.toFixed(2), '6.42');
});

test('countDoneSets counts only completed sets', () => {
  const doneSets = countDoneSets({
    sets: {
      squat: [{ done: true }, { done: false }],
      row: [{ done: true }, { done: true }],
    },
  });

  assert.equal(doneSets, 3);
});

test('buildPeriodSummary aggregates workouts, cardio, and body deltas for a period', () => {
  const summary = buildPeriodSummary({
    workouts: {
      '2026-03-31': { completed: true, sets: { a: [{ done: true }, { done: false }] } },
      '2026-04-02': { completed: true, sets: { b: [{ done: true }, { done: true }] } },
      '2026-04-05': { completed: false, sets: { c: [{ done: true }] } },
    },
    cardio: [
      { date: '2026-04-01', distKm: 4.2, steps: 5000, calories: 280 },
      { date: '2026-04-03', steps: 3000, calories: 180 },
    ],
    measurements: [
      { id: 'm1', date: '2026-03-30', weight: 88.4, fatPct: 21.5 },
      { id: 'm2', date: '2026-04-02', weight: 87.9, fatPct: 21.0 },
      { id: 'm3', date: '2026-04-04', weight: 87.3, fatPct: 20.6 },
    ],
  }, '2026-04-01', '2026-04-06');

  assert.equal(summary.workoutCount, 1);
  assert.equal(summary.doneSets, 2);
  assert.equal(summary.cardioSessions, 2);
  assert.equal(summary.cardioDistance.toFixed(2), '6.39');
  assert.equal(summary.steps, 8000);
  assert.equal(summary.calories, 460);
  assert.equal(summary.measurementCount, 2);
  assert.equal(summary.weightDelta, -0.6);
  assert.equal(summary.fatDelta, -0.4);
  assert.deepEqual(summary.latestMeasurement, { id: 'm3', date: '2026-04-04', weight: 87.3, fatPct: 20.6 });
});

test('getMonthRange and getShiftedMonthRange return stable month boundaries', () => {
  assert.deepEqual(getMonthRange('2026-04-04'), {
    start: '2026-04-01',
    end: '2026-04-30',
  });

  assert.deepEqual(getShiftedMonthRange('2026-04-04', -1), {
    start: '2026-03-01',
    end: '2026-03-31',
  });
});

test('sortTrainingPlanDays orders days by weekday and preserves ids', () => {
  const sorted = sortTrainingPlanDays({
    c: { name: 'Push', weekday: 4 },
    a: { name: 'Legs', weekday: 0 },
    b: { name: 'Pull', weekday: 2 },
  });

  assert.deepEqual(
    sorted.map(day => ({ id: day.id, name: day.name, weekday: day.weekday })),
    [
      { id: 'a', name: 'Legs', weekday: 0 },
      { id: 'b', name: 'Pull', weekday: 2 },
      { id: 'c', name: 'Push', weekday: 4 },
    ]
  );
});

test('buildTrainingWeekSchedule maps custom days to calendar dates', () => {
  const schedule = buildTrainingWeekSchedule({
    day2: { name: 'Upper', weekday: 3 },
    day1: { name: 'Lower', weekday: 1 },
  }, '2026-04-06');

  assert.deepEqual(
    schedule.map(day => ({ id: day.id, date: day.date })),
    [
      { id: 'day1', date: '2026-04-07' },
      { id: 'day2', date: '2026-04-09' },
    ]
  );
});

test('findNextAvailableTrainingWeekday returns first free slot from preferred sequence', () => {
  const weekday = findNextAvailableTrainingWeekday({
    A: { weekday: 0 },
    B: { weekday: 2 },
    C: { weekday: 4 },
  });

  assert.equal(weekday, 1);
});

test('normalizeTrainingWeekday falls back to a valid weekday when data is missing', () => {
  assert.equal(normalizeTrainingWeekday(undefined, 0), 0);
  assert.equal(normalizeTrainingWeekday(undefined, 3), 1);
  assert.equal(normalizeTrainingWeekday(6, 2), 6);
});
