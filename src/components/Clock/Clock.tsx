import React, { useEffect, useState } from 'react';
import './Clock.css';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Clock() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000); // actualiza cada segundo
    return () => clearInterval(interval);
  }, []);

  const formatted = (() => {
    const weekday = capitalize(new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(now));
    const day = new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(now);
    const month = capitalize(new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(now));
    const year = new Intl.DateTimeFormat('es-ES', { year: 'numeric' }).format(now);
    const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    return `${weekday} ${day} de ${month} ${year}, ${time}`;
  })();

  return (
    <div className="app-clock" aria-live="polite">
      {formatted}
    </div>
  );
}

export default Clock;

