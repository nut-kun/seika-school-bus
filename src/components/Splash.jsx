
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import busImage from '../assets/bus.png';

export default function Splash({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000); // 2 seconds splash
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}
        >
            <motion.img
                src={busImage}
                alt="Seika Bus"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ width: '150px', objectFit: 'contain', marginBottom: '1.5rem' }}
            />
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.1em', color: '#333', fontFamily: '"Noto Sans JP", sans-serif', textAlign: 'center' }}
            >
                KYOTO SEIKA SCHOOL BUS
            </motion.div>
        </motion.div>
    );
}
