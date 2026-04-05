(function(root, factory) {
  const api = factory();
  root.KECore = Object.assign(root.KECore || {}, api);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const CARDIO_STEP_LENGTH_M = 0.73;
  const TRAINING_WEEKDAY_SEQUENCE = [0, 2, 4, 1, 3, 5, 6];

  function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function toDateString(date) {
    const dt = new Date(date);
    return dt.getFullYear() + '-'
      + String(dt.getMonth() + 1).padStart(2, '0') + '-'
      + String(dt.getDate()).padStart(2, '0');
  }

  function getEntryDistanceKm(entry, stepLengthM = CARDIO_STEP_LENGTH_M) {
    const explicitDistance = toNumber(entry?.distKm);
    if (explicitDistance > 0) {
      return explicitDistance;
    }

    return toNumber(entry?.steps) * stepLengthM / 1000;
  }

  function sumCardioDistance(entries, stepLengthM = CARDIO_STEP_LENGTH_M) {
    return (entries || []).reduce(
      (sum, entry) => sum + getEntryDistanceKm(entry, stepLengthM),
      0
    );
  }

  function computeCardioMetrics(durationMinutes, distanceKm) {
    const duration = toNumber(durationMinutes);
    const distance = toNumber(distanceKm);

    if (duration <= 0 || distance <= 0) {
      return {
        paceText: '–',
        speedText: '–',
        paceMinutesPerKm: null,
        speedKmH: null,
      };
    }

    const totalPaceSeconds = Math.round((duration * 60) / distance);
    const minutes = Math.floor(totalPaceSeconds / 60);
    const seconds = totalPaceSeconds % 60;
    const speedKmH = distance / (duration / 60);

    return {
      paceText: `${minutes}:${String(seconds).padStart(2, '0')}`,
      speedText: speedKmH.toFixed(2),
      paceMinutesPerKm: totalPaceSeconds / 60,
      speedKmH,
    };
  }

  function createCardioEntry({ id, date, duration, calories, steps, heartRate, distKm }) {
    return {
      id: id || Date.now().toString(),
      date: date || '',
      duration: toNumber(duration),
      calories: toNumber(calories),
      steps: toNumber(steps),
      heartRate: toNumber(heartRate),
      distKm: +toNumber(distKm).toFixed(2),
    };
  }

  function normalizeTrainingWeekday(weekday, fallbackIndex = 0) {
    const parsed = Number(weekday);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 6) {
      return parsed;
    }

    return TRAINING_WEEKDAY_SEQUENCE[fallbackIndex] ?? Math.min(Math.max(fallbackIndex, 0), 6);
  }

  function sortTrainingPlanDays(daysById) {
    return Object.entries(daysById || {})
      .map(([id, day], index) => ({
        id,
        ...day,
        weekday: normalizeTrainingWeekday(day?.weekday, index),
      }))
      .sort((a, b) => a.weekday - b.weekday || String(a.name || a.id).localeCompare(String(b.name || b.id)));
  }

  function buildTrainingWeekSchedule(daysById, mondayDate) {
    const monday = new Date(`${mondayDate}T00:00:00`);

    return sortTrainingPlanDays(daysById).map(day => {
      const scheduledDate = new Date(monday);
      scheduledDate.setDate(scheduledDate.getDate() + day.weekday);

      return {
        ...day,
        date: toDateString(scheduledDate),
      };
    });
  }

  function findNextAvailableTrainingWeekday(daysById) {
    const usedWeekdays = new Set(sortTrainingPlanDays(daysById).map(day => day.weekday));
    return TRAINING_WEEKDAY_SEQUENCE.find(weekday => !usedWeekdays.has(weekday)) ?? null;
  }

  function countDoneSets(workout) {
    if (!workout?.sets) return 0;

    return Object.values(workout.sets).reduce(
      (sum, sets) => sum + sets.filter(set => set.done).length,
      0
    );
  }

  function buildPeriodSummary(data, startDate, endDate, stepLengthM = CARDIO_STEP_LENGTH_M) {
    const workouts = Object.entries(data?.workouts || {})
      .filter(([date, workout]) => date >= startDate && date <= endDate && workout.completed);
    const cardioEntries = (data?.cardio || []).filter(
      entry => entry.date >= startDate && entry.date <= endDate
    );
    const measurements = [...(data?.measurements || [])].sort((a, b) => a.date.localeCompare(b.date));
    const periodMeasurements = measurements.filter(
      entry => entry.date >= startDate && entry.date <= endDate
    );
    const baselineMeasurement = measurements.filter(
      entry => entry.date < startDate
    ).slice(-1)[0] || null;
    const startMeasurement = periodMeasurements[0] || baselineMeasurement || null;
    const endMeasurement = periodMeasurements.length
      ? periodMeasurements[periodMeasurements.length - 1]
      : (measurements.filter(entry => entry.date <= endDate).slice(-1)[0] || null);

    let weightDelta = null;
    let fatDelta = null;

    if (startMeasurement && endMeasurement && startMeasurement.id !== endMeasurement.id) {
      weightDelta = +((toNumber(endMeasurement.weight) - toNumber(startMeasurement.weight)).toFixed(1));

      if (startMeasurement.fatPct != null && endMeasurement.fatPct != null) {
        fatDelta = +((toNumber(endMeasurement.fatPct) - toNumber(startMeasurement.fatPct)).toFixed(1));
      }
    }

    return {
      workoutCount: workouts.length,
      doneSets: workouts.reduce((sum, [, workout]) => sum + countDoneSets(workout), 0),
      cardioSessions: cardioEntries.length,
      cardioDistance: sumCardioDistance(cardioEntries, stepLengthM),
      steps: cardioEntries.reduce((sum, entry) => sum + toNumber(entry.steps), 0),
      calories: cardioEntries.reduce((sum, entry) => sum + toNumber(entry.calories), 0),
      measurementCount: periodMeasurements.length,
      latestMeasurement: periodMeasurements.length ? periodMeasurements[periodMeasurements.length - 1] : null,
      weightDelta,
      fatDelta,
    };
  }

  function getMonthRange(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');

    return {
      start: toDateString(new Date(d.getFullYear(), d.getMonth(), 1)),
      end: toDateString(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
    };
  }

  function getShiftedMonthRange(dateStr, offset) {
    const d = new Date(dateStr + 'T00:00:00');

    return {
      start: toDateString(new Date(d.getFullYear(), d.getMonth() + offset, 1)),
      end: toDateString(new Date(d.getFullYear(), d.getMonth() + offset + 1, 0)),
    };
  }

  return {
    CARDIO_STEP_LENGTH_M,
    TRAINING_WEEKDAY_SEQUENCE,
    buildPeriodSummary,
    buildTrainingWeekSchedule,
    computeCardioMetrics,
    countDoneSets,
    createCardioEntry,
    findNextAvailableTrainingWeekday,
    getEntryDistanceKm,
    getMonthRange,
    getShiftedMonthRange,
    normalizeTrainingWeekday,
    sortTrainingPlanDays,
    sumCardioDistance,
  };
});
