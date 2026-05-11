import { useState } from "react";
import "../css/mainPage.css";

// ─── Types ───
const KR_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// ─── Helpers ───
function getKRNow(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 3600000);
}
function toYMD(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ─── UI Icons ───
const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#555"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#888"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#888"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#888"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const PencilIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// ─── Menu Icons ───
const SaveIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const ViewIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ThemeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─── Calendar Cell Component ───
function CalendarCell({
  day,
  dayOfWeek,
  isCurrentMonth,
  isToday,
  events,
}: any) {
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  return (
    <div className={`calendar-cell ${isToday ? "today-cell" : ""}`}>
      <div
        className={`cell-day-number ${!isCurrentMonth ? "out-of-month" : ""} ${isToday ? "today-number" : ""} ${!isToday && isSunday ? "sunday-number" : ""} ${!isToday && isSaturday ? "saturday-number" : ""}`}
      >
        {isToday ? (
          <span className="today-badge">{day}</span>
        ) : (
          <span>{day}</span>
        )}
      </div>
      <div className="cell-events">
        {events.slice(0, 2).map((ev: any) => (
          <div key={ev.id} className="event-chip">
            <span className="event-title">{ev.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function DadoMainPage() {
  const krNow = getKRNow();
  const [viewYear, setViewYear] = useState(krNow.getFullYear());
  const [viewMonth, setViewMonth] = useState(krNow.getMonth());
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [todayStr] = useState(
    toYMD(krNow.getFullYear(), krNow.getMonth(), krNow.getDate()),
  );

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 400);
  };

  const firstDOW = getFirstDayOfWeek(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const daysInPrevMonth = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1,
  );

  const cells = [];
  for (let i = firstDOW - 1; i >= 0; i--)
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, isCurrentMonth: true });
  while (cells.length < 42)
    cells.push({
      day: cells.length - (firstDOW + daysInMonth) + 1,
      isCurrentMonth: false,
    });

  const weeks = [];
  for (let i = 0; i < 6; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));

  const menuItems = [
    { label: "달력 저장", icon: <SaveIcon /> },
    { label: "보기 설정", icon: <ViewIcon /> },
    { label: "테마", icon: <ThemeIcon /> },
    { label: "설정", icon: <SettingsIcon /> },
    { label: "로그아웃", icon: <LogoutIcon />, danger: true },
  ];

  return (
    <div className="dado-app">
      <header className="header">
        <div className="header-logo">
          <div className="logo-circle">🐠</div>
          <span className="logo-text">DADO</span>
        </div>
        <div className="header-pet">🐑</div>
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <HamburgerIcon />
        </button>
      </header>

      <main className="calendar-wrapper">
        <div className="calendar-nav">
          <span className="calendar-title">
            {viewYear}년 {viewMonth + 1}월
          </span>
          <div className="nav-controls">
            <button
              className="nav-btn"
              onClick={() =>
                viewMonth === 0
                  ? (setViewYear((v) => v - 1), setViewMonth(11))
                  : setViewMonth((v) => v - 1)
              }
            >
              <ChevronLeft />
            </button>
            <button
              className="today-btn"
              onClick={() => {
                setViewYear(krNow.getFullYear());
                setViewMonth(krNow.getMonth());
              }}
            >
              오늘
            </button>
            <button
              className="nav-btn"
              onClick={() =>
                viewMonth === 11
                  ? (setViewYear((v) => v + 1), setViewMonth(0))
                  : setViewMonth((v) => v + 1)
              }
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="day-headers">
            {KR_DAYS.map((d, i) => (
              <div
                key={d}
                className={`day-header ${i === 0 ? "sunday" : i === 6 ? "saturday" : ""}`}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="calendar-weeks">
            {weeks.map((week, wi) => (
              <div className="calendar-week" key={wi}>
                {week.map((cell, ci) => (
                  <CalendarCell
                    key={ci}
                    day={cell.day}
                    dayOfWeek={ci}
                    isCurrentMonth={cell.isCurrentMonth}
                    isToday={
                      cell.isCurrentMonth &&
                      toYMD(viewYear, viewMonth, cell.day) === todayStr
                    }
                    events={[]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      <button className="fab">
        <PencilIcon />
      </button>

      {menuOpen && (
        <>
          <div
            className={`overlay ${isClosing ? "fade-out" : ""}`}
            onClick={handleCloseMenu}
          />
          <div className={`side-menu ${isClosing ? "closing" : ""}`}>
            <div className="side-menu-header">
              <div className="side-menu-title">설정</div>
              <button className="close-btn" onClick={handleCloseMenu}>
                <CloseIcon />
              </button>
            </div>
            <div className="menu-items-container">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className={`side-menu-item ${item.danger ? "danger" : ""}`}
                >
                  <span className="menu-item-icon">{item.icon}</span>
                  <span className="menu-item-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
