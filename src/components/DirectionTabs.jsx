
import React from 'react';
import { motion } from 'framer-motion';

export default function DirectionTabs({ direction, setDirection }) {

    return (
        <div className="tabs-wrapper">
            <div className="tabs-container">
                <button
                    onClick={() => setDirection('kokusai_to_seika')}
                    className={`tab-button ${direction === 'kokusai_to_seika' ? 'tab-active' : 'tab-inactive'}`}
                >
                    国際会館発
                    {direction === 'kokusai_to_seika' && (
                        <motion.div
                            layoutId="activeTab"
                            className="line-indicator"
                            // Note: 'line-indicator' style is not critical if we use bg color change, 
                            // but we can add it to CSS if we want the line. 
                            // The CSS 'tab-active' handles the big block style nicely.
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
