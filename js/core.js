(function(root, factory) {
  const api = factory();
  root.KECore = Object.assign(root.KECore || {}, api);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const CARDIO_STEP_LENGTH_M = 0.73;

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
    buildPeriodSummary,
    computeCardioMetrics,
    countDoneSets,
    createCardioEntry,
    getEntryDistanceKm,
    getMonthRange,
    getShiftedMonthRange,
    sumCardioDistance,
  };
});
