
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
            <div className="header-time">
                現在時刻：{format(currentTime, 'HH:mm:ss')}
            </div>
        </div>
    );
}
