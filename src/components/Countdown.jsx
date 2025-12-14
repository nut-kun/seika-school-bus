
import React, { useEffect, useState } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { getNextBus } from '../utils/time';
import { motion } from 'framer-motion';
import busImage from '../assets/bus.png';

export default function Countdown({ currentDate, direction, status, isToday, now }) {
    const [nextBus, setNextBus] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const update = () => {
            const bus = getNextBus(currentDate, direction);
            setNextBus(bus);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [currentDate, direction]);

    useEffect(() => {
        if (!nextBus) { // Simplified condition: removed nextBus.type === 'interval' || !isToday
            setTimeLeft('');
            return;
        }

        const startReal = Date.now();
        const startVirtual = now.getTime();

        const tick = () => {
            // Calculate virtual current time based on elapsed real time
            // This ensures we respect DEBUG_DATE (passed as 'now') while keeping the countdown ticking
            const elapsed = Date.now() - startReal;
            const currentMoment = new Date(startVirtual + elapsed);

            const diff = differenceInSeconds(nextBus.nextTime, currentMoment);

            if (diff <= 0) {
                setTimeLeft('00:00');
            } else {
                const m = Math.floor(diff / 60);
                const s = diff % 60;
                setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
            }
        };

        tick(); // Initial call
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [nextBus, now]); // Added 'now' to dependencies to reset if reference time changes


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
            // Future/Past Date: Show STATUS here (as header now shows DATE)
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '2rem 0' }}>
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
        <div className="countdown-card">
            {/* Blobs */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '200px', height: '200px', backgroundColor: 'white', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '150px', height: '150px', backgroundColor: 'white', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

            {renderContent()}
        </div>
    );
}
