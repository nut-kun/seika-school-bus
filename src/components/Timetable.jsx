
import React from 'react';
import { getScheduleCurrent } from '../utils/time';

export default function Timetable({ currentDate, direction }) {
    const { data, type } = getScheduleCurrent(currentDate);
    const targetSchedule = data ? data[direction] : null;

    if (!targetSchedule) {
        return (
            <div className="text-center" style={{ padding: '2rem', color: '#9CA3AF' }}>
                時刻表がありません
            </div>
        );
    }

    const hours = Array.from({ length: 14 }, (_, i) => i + 8);

    return (
        <div className="timetable-section">
            <h3 className="timetable-title">時刻表</h3>
            <div className="timetable-card">
                <div className="timetable-header">
                    <div className="p-3 text-center font-bold text-gray-600 text-sm" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>時</div>
                    <div className="p-3 text-left font-bold text-gray-600 text-sm" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center' }}>分</div>
                </div>
                {hours.map(h => {
                    const entry = targetSchedule[h];
                    if (!entry) {
                        return (
                            <div key={h} className="timetable-row">
                                <div className="hour-cell">
                                    {h}
                                </div>
                                <div className="minute-cell">
                                    -
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={h} className="timetable-row">
                            <div className="hour-cell">
                                {h}
                            </div>
                            <div className="minute-cell">
                                {entry.type === 'interval' ? (
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563' }}>
                                        {entry.text}
                                    </span>
                                ) : (
                                    entry.times.map(m => (
                                        <span key={m} className="minute-bubble">
                                            {String(m).padStart(2, '0')}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
