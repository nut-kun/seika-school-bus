
import React, { useEffect, useState } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { getNextBus } from '../utils/time';
import { motion } from 'framer-motion';
import busImage from '../assets/bus.png';

export default function Countdown({ currentDate, direction, status, isToday, now }) {
    const [nextBus, setNextBus] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Initial setup
        const update = () => {
            // If isToday, we should use the current REAL time (or debug time) for the schedule lookup
            // otherwise we use the static currentDate (which might be 00:00 of a future date, or a fixed time)
            const baseTime = isToday ? (now || new Date()) : currentDate;
            const bus = getNextBus(baseTime, direction);
            setNextBus(bus);
        };
        update();

        // We don't need a separate interval here if the main tick handles updates
        // But the main tick depends on 'nextBus' existing.
    }, [currentDate, direction, isToday, now]);

    useEffect(() => {
        // Main Loop
        const startReal = Date.now();
        const startVirtual = now.getTime();

        const tick = () => {
            const elapsed = Date.now() - startReal;
            const currentMoment = new Date(startVirtual + elapsed);

            // If we don't have a next bus, or if we are today, we should constantly check for the next bus?
            // Actually, if we have a next bus, we count down TO it.
            // If we don't, we might need to find one.

            // Re-evaluating next bus inside loop only if needed
            let currentTargetBus = nextBus;

            // If isToday, we want to ensure we are always targeting the correct future bus
            // The 'update' effect above sets the initial one.
            // If time passes and that bus is gone, we need a new one.

            if (isToday) {
                // Check if current target is invalid or expired
                // But we can't easily access 'nextBus' state here without it being in deps (which restarts interval).
                // Instead, let's calculate the target bus directly here if we are "live".
                // BUT 'getNextBus' might change the 'nextBus' object ref, causing loop if we set state every tick.

                // Strategy: Calculate 'diff' against the 'nextBus' from state.
                // If diff <= 0, we Re-Fetch next bus using currentMoment.
                // If that new bus is different, we setTimeLeft AND setNextBus?
                // We can't setNextBus inside the tick loop easily without layout thrashing or complexity.

                // Simpler: 
                // Just check 'diff'.
                if (currentTargetBus) {
                    const diff = differenceInSeconds(currentTargetBus.nextTime, currentMoment);
                    if (diff <= 0 && isToday) {
                        // Bus departed. Find next one.
                        const newBus = getNextBus(currentMoment, direction);
                        // If we found a NEW bus (different time), update state
                        if (newBus && newBus.nextTime.getTime() !== currentTargetBus.nextTime.getTime()) {
                            setNextBus(newBus);
                            // The next tick will handle the time left for THIS new bus
                            return;
                        }
                    }

                    if (diff <= 0) {
                        setTimeLeft('00:00');
                    } else {
                        const m = Math.floor(diff / 60);
                        const s = diff % 60;
                        setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
                    }
                }
            } else {
                // Not today: Logic handled by initial fetch usually
                if (currentTargetBus) {
                    // Static countdown? Probably not needed for future dates as per requirements (simplified view).
                    // But if we did:
                    const diff = differenceInSeconds(currentTargetBus.nextTime, currentMoment);
                    // ... logic
                }
            }
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [nextBus, now, isToday, direction]); // Added dependencies to reset timer when bus changes


    if (status.status === 'LOADING') {
        return (
            <div className="countdown-card" style={{ justifyContent: 'center' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                />
                <div style={{ marginTop: '1rem', opacity: 0.9 }}>
                    {status.message}
                </div>
            </div>
        );
    }

    if (status.status === 'SUSPENDED') {
        return (
            <div className="countdown-card">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>運休</h2>
                <p style={{ opacity: 0.9 }}>{status.message}</p>
            </div>
        );
    }

    if (status.status === 'SPECIAL') {
        return (
            <div className="countdown-card">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>特別運行</h2>
                <p style={{ opacity: 0.9, marginBottom: '1rem' }}>{status.message}</p>
                <a href={status.url} target="_blank" rel="noreferrer"
                    style={{ backgroundColor: 'white', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 'bold', textDecoration: 'none' }}>
                    サイトを見る
                </a>
            </div>
        );
    }

    // Determine Main Content based on isToday
    const renderContent = () => {
        if (!isToday) {
            // Future/Past Date: Compact View
            // User requested: "Shorten countdown-card height" and show Status/Date.
            return (
                <div style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {format(currentDate, 'M/d')}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.9 }}>
                        {status.message}
                    </div>
                </div>
            );
        }

        // Today
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, opacity: 0.8, marginBottom: '0.25rem' }}>
                    {nextBus ? '次は' : '本日の運行は終了しました'}
                </div>

                {nextBus?.type === 'specific' ? (
                    <div>
                        <div style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1, margin: '0.5rem 0', fontFamily: 'monospace' }}>
                            {format(nextBus.nextTime, 'HH:mm')}
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, marginTop: '0.5rem' }}>
                            あと {timeLeft || '00:00'}
                        </div>
                    </div>
                ) : nextBus?.type === 'interval' ? (
                    <div className="flex flex-col items-center">
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0' }}>
                            {nextBus.text}
                        </div>
                    </div>
                ) : (
                    <div style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '2rem 0' }}>
                        END
                    </div>
                )}

                <div style={{ marginTop: '2rem', fontSize: '0.875rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 1rem', borderRadius: '9999px', backdropFilter: 'blur(12px)', display: 'inline-block' }}>
                    本日は{status.message}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="countdown-card" style={!isToday ? { minHeight: 'auto', paddingBottom: '1.5rem' } : {}}>
            {/* Blobs */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '200px', height: '200px', backgroundColor: 'white', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '150px', height: '150px', backgroundColor: 'white', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

            {renderContent()}
        </div>
    );
}
