import ICAL from 'ical.js';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

// Calendar IDs from the user provided URL (decoded from Src param)
// Note: These are base64 encoded in the embed URL usually, but let's just use the ones provided.
// wait, the URL string provided in the prompt had `src=ajE...`
// These look like encoded strings.
// "ajEydDdocjI1dmxqYWYxdXBqdDNyZmxiMW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
// decodes to "j12d7hr25vljaf1upjt3rflb1o@group.calendar.google.com" ?
// Let's try to decode them in the code just in case, or use them if they are valid.
// Actually, I can just use the exact string directly if I use the public ics URL format:
// https://calendar.google.com/calendar/ical/<ID>/public/basic.ics

const CALENDAR_IDS = [
    "j12d7hr25vljaf1upjt3rflb1o@group.calendar.google.com", // Decoded from 1st
    "r9emnh13lfnsjt1nhskoixsht0@group.calendar.google.com", // Decoded from 2nd (guess d/r overlap? let's try generic decoding)
    // To be safe, I will implement a Base64 decoder for valid email check, or just try to use the raw value if it fails.
    // Actually, the easiest way is to use the direct public ICal URL if I can finding it.
    // For this tasks, I'll use a reliable list.
    // Since I can't confirm the decoded values 100% without running code,
    // I will write a helper to decode the SRC parameters if they don't look like emails.
];

// Re-decoding the 'src' params from the prompt to be sure:
// src=ajEydDdocjI1dmxqYWYxdXBqdDNyZmxiMW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ
// src=cjllbW5oMTNsZm5zanQxbmhza29pcXNodDBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ
// ...
// I will put the RAW strings here and decode them at runtime.
const RAW_SRC_IDS = [
    "ajEydDdocjI1dmxqYWYxdXBqdDNyZmxiMW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
    "cjllbW5oMTNsZm5zanQxbmhza29pcXNodDBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
    "bnJpdjVzdWcxNzlpbmVxYmlha2h1c2Z1c2dAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
    "NThoczAzOXNoNm1jY3JicGl2a2lrazFzcGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
    "ZWFkM2ZyczhhcGFpOG9pdnVrbGRoNWpkNW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
    "bDNmYzA5MWEzbG9wNGM5aGxkN2FjMzhkMG9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
];

const decodeId = (id) => {
    try {
        return atob(id);
    } catch (e) {
        return id;
    }
};

// Cache for events to avoid re-fetching
let cachedEvents = null;
let fetchPromise = null;

export const fetchCalendarStatus = async (date) => {
    // Determine status for the given date
    // Returns: { status: 'NORMAL' | 'SPECIAL' | 'SUSPENDED', message: string, url: string | null }

    // CORS Proxy
    const PROXY = "https://api.allorigins.win/raw?url=";

    try {
        // Use cache if available
        if (!cachedEvents) {
            // If a fetch is already in progress, reuse the promise
            if (!fetchPromise) {
                fetchPromise = (async () => {
                    const calendarIds = RAW_SRC_IDS.map(decodeId);

                    // Fetch all calendars in parallel
                    const promises = calendarIds.map(async (calId) => {
                        const url = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calId)}/public/basic.ics`;
                        try {
                            // Add cache buster or handling if needed, but for now standard fetch
                            const res = await fetch(`${PROXY}${encodeURIComponent(url)}`);
                            if (!res.ok) return [];
                            const text = await res.text();
                            const jcalData = ICAL.parse(text);
                            const comp = new ICAL.Component(jcalData);
                            const vevents = comp.getAllSubcomponents('vevent');

                            return vevents.map(event => {
                                const ev = new ICAL.Event(event);
                                return {
                                    summary: ev.summary,
                                    startDate: ev.startDate.toJSDate(),
                                    endDate: ev.endDate.toJSDate(),
                                    description: ev.description
                                };
                            });
                        } catch (e) {
                            console.warn(`Failed to fetch/parse calendar ${calId}`, e);
                            return [];
                        }
                    });

                    const results = await Promise.all(promises);
                    return results.flat();
                })();
            }

            try {
                cachedEvents = await fetchPromise;
            } finally {
                // Keep the cache, but clear promise so we don't hold it if it failed (though we catch inside)
                fetchPromise = null;
            }
        }

        const allEvents = cachedEvents || [];

        const checkDateStart = startOfDay(new Date(date));
        const checkDateEnd = endOfDay(new Date(date));

        // Filter for today
        const todaysEvents = allEvents.filter(ev => {
            // Check overlap: [start, end) intersects [checkStart, checkEnd]
            return ev.startDate <= checkDateEnd && ev.endDate > checkDateStart;
        });

        // Check keywords
        // Priority: Suspended > Special > Normal
        const suspendedEvent = todaysEvents.find(e => e.summary.includes('運休'));
        const specialEvent = todaysEvents.find(e => e.summary.includes('特別運行'));
        const normalEvent = todaysEvents.find(e => e.summary.includes('通常運行'));

        if (suspendedEvent) {
            return { status: 'SUSPENDED', message: suspendedEvent.summary, url: null };
        }
        if (specialEvent) {
            return { status: 'SPECIAL', message: specialEvent.summary, url: 'https://www.kyoto-seika.ac.jp/bus.html' };
        }
        if (normalEvent) {
            return { status: 'NORMAL', message: normalEvent.summary, url: null };
        }

        return { status: 'NORMAL', message: '通常運行です', url: null };

    } catch (error) {
        console.error("Calendar fetch failed", error);
        return { status: 'NORMAL', message: '通常運行です(Offline)', url: null };
    }
};
