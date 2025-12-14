
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function Header({ currentDate, setDate, isToday, onBackToToday }) {
    const handlePrev = () => setDate(d => subDays(d, 1));
    const handleNext = () => setDate(d => addDays(d, 1));

    return (
        <div className="header">
            <h1 className="header-title">
                KYOTO SEIKA SCHOOL BUS
            </h1>

            <div className="date-picker">
                <button onClick={handlePrev} className="nav-button">
                    ◀
                </button>
                <div className="flex flex-col items-center mx-2">
                    <span className="date-text">
                        {format(currentDate, 'M月d日 (E)', { locale: ja })}
                    </span>
                    {!isToday && (
                        <button
                            onClick={onBackToToday}
                            className="back-to-today-btn"
                        >
                            今日に戻る
                        </button>
                    )}
                </div>
                <button onClick={handleNext} className="nav-button">
                    ▶
                </button>
            </div>
        </div>
    );
}
