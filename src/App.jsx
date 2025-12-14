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
  const initialDate = DEBUG_DATE ? new Date(DEBUG_DATE) : new Date();

  const [currentDate, setDate] = useState(initialDate);
  const [direction, setDirection] = useState('kokusai_to_seika');
  const [status, setStatus] = useState({ status: 'LOADING', message: '読み込み中...' });

  // Sticky Tabs Logic
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = React.useRef(null);

  const now = DEBUG_DATE ? new Date(DEBUG_DATE) : new Date();
  const isToday = currentDate.toDateString() === now.toDateString();

  useEffect(() => {
    const loadStatus = async () => {
      setStatus({ status: 'LOADING', message: '確認中...（最大1分ほどかかる場合があります）' });
      const res = await fetchCalendarStatus(currentDate);
      setStatus(res);
    };
    loadStatus();
  }, [currentDate]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Trigger when sentinel (placed before Timetable) goes out of view at the top.
      // rootMargin is -70px, so intersection ends when element is at top:70px.
      // So if (!isIntersecting) and (top < 80), it implies it's above the trigger line.
      if (!entry.isIntersecting && entry.boundingClientRect.top < 80) {
        setIsStuck(true);
      } else {
        setIsStuck(false);
      }
    }, { rootMargin: '-70px 0px 0px 0px' });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBackToToday = () => {
    setDate(now);
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <AnimatePresence>
        {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

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

      <DirectionTabs
        direction={direction}
        setDirection={setDirection}
        isStuck={isStuck}
      />

      <Countdown
        currentDate={currentDate}
        direction={direction}
        status={status}
        isToday={isToday}
        now={now}
      />

      {/* Sentinel for Scroll Trigger: Placed BEFORE Timetable */}
      <div ref={sentinelRef} style={{ height: '1px', width: '100%', marginBottom: '-1px', visibility: 'hidden' }} />

      <Timetable
        currentDate={currentDate}
        direction={direction}
      />

      <Footer />
    </div>
  );
}

export default App;
