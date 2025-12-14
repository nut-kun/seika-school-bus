import React from 'react';
import { motion } from 'framer-motion';

export default function DirectionTabs({ direction, setDirection, isStuck }) {
    // Props: isStuck passed from App (based on Timetable sentinel)

    return (
        <div className="tabs-wrapper" style={{ position: 'relative' }}>
            {/* Placeholder: occupies space at the ORIGINAL location when tabs are fixed away */}
            {isStuck && (
                <div className="tabs-placeholder" style={{ height: '56px', width: '100%' }}></div>
            )}

            {/* Actual Tabs */}
            <div
                className={`tabs-container ${isStuck ? 'is-stuck-fixed' : ''}`}
            >
                <button
                    onClick={() => setDirection('kokusai_to_seika')}
                    className={`tab-button ${direction === 'kokusai_to_seika' ? 'tab-active' : 'tab-inactive'}`}
                >
                    国際会館発
                    {direction === 'kokusai_to_seika' && (
                        <motion.div
                            layoutId="activeTab"
                            className="line-indicator"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                backgroundColor: 'var(--color-primary)',
                                zIndex: -1
                            }}
                        />
                    )}
                </button>

                <button
                    onClick={() => setDirection('seika_to_kokusai')}
                    className={`tab-button ${direction === 'seika_to_kokusai' ? 'tab-active' : 'tab-inactive'}`}
                >
                    京都精華大学発
                </button>
            </div>
        </div>
    );
}
