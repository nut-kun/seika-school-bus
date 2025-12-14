import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DirectionTabs from './components/DirectionTabs';
import Countdown from './components/Countdown';
import Timetable from './components/Timetable';
import Splash from './components/Splash';
import Footer from './components/Footer';
import BrandHeader from './components/BrandHeader';
import { fetchCalendarStatus } from './utils/calendar';
import busImage from './assets/bus.png';
import seikaImage from './assets/seika.png';
import kokusaiImage from './assets/kokusaikaikan.png';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

// DEBUG: Set a specific date string (e.g., '2025-12-25T08:00:00') to test specific times. Set null to use real time.
const DEBUG_DATE = null;

function App() {
  const [showSplash, setShowSplash] = useState(true);
  // Use debug date if set, otherwise real now
  const initialDate = DEBUG_DATE ? new Date(DEBUG_DATE) : new Date();

  const [currentDate, setDate] = useState(initialDate);
  const [direction, setDirection] = useState('kokusai_to_seika'); // or 'seika_to_kokusai'
  const [status, setStatus] = useState({ status: 'LOADING', message: '読み込み中...' });

  // Calculate if the selected date matches "Today" (Real today, or Debug today)
  // If we rely on system time for "Today", we compare currentDate to new Date().
  // If we are in Debug mode, maybe "Today" is the Debug Date?
  // Let's assume "Today" means "The date currently being viewed is the same as the reference 'Now'".
  // But usually "Back to Today" means back to Real Time.
  const now = DEBUG_DATE ? new Date(DEBUG_DATE) : new Date();
  const isToday = currentDate.toDateString() === now.toDateString();

  useEffect(() => {
    // Fetch status when date changes
    const loadStatus = async () => {
      setStatus({ status: 'LOADING', message: '確認中...' });
      const res = await fetchCalendarStatus(currentDate);
      setStatus(res);
    };
    loadStatus();
  }, [currentDate]);

  const handleBackToToday = () => {
    setDate(now);
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <AnimatePresence>
        {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Background accent */}
      <div className="app-bg-accent"></div>

      <BrandHeader />

      <div className="bus-container">
        {isToday && direction === 'seika_to_kokusai' && (
          <img src={seikaImage} alt="Seika Background" className="seika-bg-image" />
        )}
        {isToday && direction === 'kokusai_to_seika' && (
          <img src={kokusaiImage} alt="Kokusai Background" className="kokusai-bg-image" />
        )}
        <img
          src={busImage}
          alt="Bus Illustration"
          className={`bus-image ${status.status !== 'SUSPENDED' ? 'animate-bus-jump' : ''}`}
        />
      </div>

      <Header
        currentDate={currentDate}
        setDate={setDate}
        isToday={isToday}
        onBackToToday={handleBackToToday}
      />

      {isToday ? (
        <DirectionTabs direction={direction} setDirection={setDirection} />
      ) : (
        <div className="tabs-wrapper">
          <div className="calendar-name-container">
            {format(currentDate, 'M/d')}
          </div>
        </div>
      )}

      <Countdown
        currentDate={currentDate}
        direction={direction}
        status={status}
        isToday={isToday}
        now={now} // Pass 'now' so Countdown uses the same reference time (especially if debug)
      />

      <Timetable
        currentDate={currentDate}
        direction={direction}
      />

      <Footer />
    </div>
  );
}

export default App;
