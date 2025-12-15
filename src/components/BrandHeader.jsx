
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function BrandHeader() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="brand-header">
            <div className="brand-header-inner">
                <span className="brand-logo-text">SEIKA BUS</span>
            </div>
            <div className="header-time" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {format(currentTime, 'HH:mm:ss')}
            </div>
        </div>
    );
}
