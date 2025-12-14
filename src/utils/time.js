
import { addMinutes, format, getHours, getMinutes, isSaturday, setHours, setMinutes } from 'date-fns';
import { schedule } from '../data/schedule';

export const getScheduleCurrent = (date) => {
    // Returns: { type: 'weekday' | 'saturday' | 'holiday', schedule: ... }
    // Simplified logic: Sunday = Holiday (No Bus usually? Check site. Usually suspended or reduced. Site didn't show Sunday table. Assume Suspended/Special.)
    // However, user said "Operation Calendar" determines status.
    // If Calendar says "Normal", we use Weekday/Saturday schedule.
    // If Calendar says "Special", we shouldn't be here (redirected).
    // If Calendar says "Suspended", we shouldn't be here.

    // So we just need Weekday vs Saturday.
    const isSat = isSaturday(date);
    // Sunday?
    const isSun = date.getDay() === 0;

    if (isSun) {
        // If Sunday is "Normal Operation", which schedule?
        // University buses usually don't run on Sundays unless Open Campus.
        // If Open Campus, it's likely "Special Schedule".
        // For now, if Sunday, treat as Holiday/Suspended or default to Saturday if forced.
        // But let's assume Weekday/Saturday logic primarily.
        return { type: 'sunday', data: null };
    }

    if (isSat) {
        return { type: 'saturday', data: schedule.saturday };
    }
    return { type: 'weekday', data: schedule.weekday };
};

export const getNextBus = (currentDate, direction) => {
    // direction: 'kokusai_to_seika' | 'seika_to_kokusai'
    const { type, data } = getScheduleCurrent(currentDate);
    if (!data) return null; // No schedule (e.g. Sunday)

    const targetSchedule = data[direction];
    if (!targetSchedule) return null;

    const currentHour = getHours(currentDate);
    const currentMinute = getMinutes(currentDate);

    // Check current hour first
    // If current hour has specific times, find next one.
    // If current hour is Interval, just return "Interval".
    // Note: if it's 8:55 and 8 is Interval, and 9 is empty, what happens?
    // User said: "Runs every 7-8 mins". 
    // If we are IN the interval hour, we show "Runs every ...".
    // If we are past the interval hour, we look for next.

    // Algorithm: Iterate hours from currentHour to 24.
    for (let h = currentHour; h <= 23; h++) {
        const entry = targetSchedule[h];
        if (!entry) continue; // No bus this hour

        if (entry.type === 'interval') {
            // If we are in this hour, we show the interval text.
            // If we are past this hour (logic loop), wait, loop starts at currentHour.
            // If we are at logic loop h > currentHour, then it's the next bus block.
            // But "Interval" usually implies undefined specific times.
            // So we can't show "20 min countdown". We show "Next: 8:00 (Start)" or "Runs every 7-8 mins".

            // If h == currentHour: 
            // Are we before the start? (Only applies if start is defined, e.g. 8:00 start)
            if (h === currentHour && entry.start) {
                // parse start "08:00"
                const [sH, sM] = entry.start.split(':').map(Number);
                if (currentMinute < sM) {
                    // We are before start. Next bus is at start.
                    const nextDate = setMinutes(setHours(currentDate, sH), sM);
                    return { type: 'specific', nextTime: nextDate };
                }
            }

            // If we are in the interval time
            if (h === currentHour) {
                return { type: 'interval', text: entry.text };
            }

            // If later hour
            return { type: 'interval', text: entry.text, startTime: `${h}:00` };
        }

        if (entry.type === 'specific') {
            // Check times
            const times = entry.times; // sorted array [0, 10, 20...]

            for (let m of times) {
                if (h > currentHour || (h === currentHour && m > currentMinute)) {
                    const nextDate = setMinutes(setHours(currentDate, h), m);
                    return { type: 'specific', nextTime: nextDate };
                }
            }
        }
    }

    return null; // No more buses today
};

export const getFirstBusTime = (currentDate, direction) => {
    const { data } = getScheduleCurrent(currentDate);
    if (!data) return null;

    const targetSchedule = data[direction];
    if (!targetSchedule) return null;

    for (let h = 0; h <= 23; h++) {
        const entry = targetSchedule[h];
        if (!entry) continue;

        let m = 0;
        if (entry.type === 'interval') {
            if (entry.start) {
                const parts = entry.start.split(':');
                m = parseInt(parts[1], 10);
            } else {
                continue; // Skip interval without start if searching for absolute first? Or assume 0? 
                // Schedule data has start: '08:00' for first hour.
            }
        } else if (entry.type === 'specific') {
            if (entry.times && entry.times.length > 0) {
                m = entry.times[0];
            } else {
                continue;
            }
        }

        return setMinutes(setHours(currentDate, h), m);
    }
    return null;
};
