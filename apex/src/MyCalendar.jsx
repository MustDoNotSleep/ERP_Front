import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style/MyCalendar.css';

const eventDates = [
  new Date(2025, 9, 3), // JS에서 10월은 '9'입니다.
  new Date(2025, 9, 5),
  new Date(2025, 9, 6),
  new Date(2025, 9, 7),
  new Date(2025, 9, 8),
  new Date(2025, 9, 9),
];

function MyCalendar() {
  const [date, setDate] = useState(new Date(2025, 9, 1)); 

  const hasEvent = (date) => {
    return eventDates.some(
      eventDate =>
        date.getFullYear() === eventDate.getFullYear() &&
        date.getMonth() === eventDate.getMonth() &&
        date.getDate() === eventDate.getDate()
    );
  };

  return (
    <Calendar
      onChange={setDate}
      value={date}
      calendarType="gregory"
      formatDay={(locale, date) => date.getDate()}
      navigationLabel={({ date }) => `${date.toLocaleString('en-US', { month: 'long' })}`}
      showNeighboringMonth={true}

      // --- ❗❗❗ 핵심 수정 사항 ❗❗❗ ---
      // 요일을 'Sun', 'Mon' 형식의 영어로 표시합니다.
      formatShortWeekday={(locale, date) => date.toLocaleString('en-US', { weekday: 'short' })}

      tileContent={({ date, view }) =>
        view === 'month' && hasEvent(date) ? <div className="event-dot"></div> : null
      }
    />
  );
}

export default MyCalendar;