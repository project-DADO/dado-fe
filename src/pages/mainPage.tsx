import { useState } from "react";
import "../css/mainPage.css";
import SelectDrawage from "./selectDrawpage";
import DrawingWithPaint from "./drawingWithPaint";
import { useDrawingsStore, getSaveErrorMessage } from "../store/drawings-store";

// ─── Helpers ───
const KR_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
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

// ─── Icons ───
const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PencilIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#333"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
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

// ─── Main Component ───
export default function DadoMainPage() {
  const krNow = getKRNow();
  const [viewYear, setViewYear] = useState(krNow.getFullYear());
  const [viewMonth, setViewMonth] = useState(krNow.getMonth());
  const [todayStr] = useState(
    toYMD(krNow.getFullYear(), krNow.getMonth(), krNow.getDate()),
  );

  const [isDrawageOpen, setIsDrawageOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const drawings = useDrawingsStore((s) => s.drawings);
  const saveDrawing = useDrawingsStore((s) => s.saveDrawing);
  const isSaving = useDrawingsStore((s) => s.isSaving);
  const setStoreTargetDate = useDrawingsStore((s) => s.setTargetDate);
  const [isPaintOpen, setIsPaintOpen] = useState(false);

  const handleOpenDrawage = (day: number) => {
    const dateStr = toYMD(viewYear, viewMonth, day);
    setTargetDate(dateStr);
    setStoreTargetDate(dateStr);
    setIsDrawageOpen(true);
  };

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 400);
  };

  const handleSaveDrawing = async (imgDataUrl: string) => {
    if (!targetDate) return;

    try {
      await saveDrawing(targetDate, imgDataUrl);
      alert(`${targetDate} 칸에 그림이 성공적으로 삽입되었습니다!`);
      setIsPaintOpen(false);
    } catch (error) {
      alert(getSaveErrorMessage(error));
    }
  };

  // 캘린더 데이터 생성
  const firstDOW = getFirstDayOfWeek(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const cells = [];
  const prevMonthYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

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

  return (
    <div className="dado-app">
      <header className="header">
        <div className="header-logo">
          <div className="logo-circle">🐠</div>
          <span className="logo-text">DADO</span>
        </div>
        <div className="header-pet">🐑</div>
        <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
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
              〈
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
              〉
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
                {week.map((cell, ci) => {
                  // 💡 각 셀의 고유 날짜 키값 추출 (현재 월에 속해있을 때만 데이터를 기록)
                  const currentCellDateStr = cell.isCurrentMonth
                    ? toYMD(viewYear, viewMonth, cell.day)
                    : "";

                  const isToday =
                    cell.isCurrentMonth && currentCellDateStr === todayStr;

                  // 💡 4. 이 날짜 칸에 저장된 삽입 이력 그림이 존재하는지 체크
                  const savedImage = drawings[currentCellDateStr];

                  return (
                    <div
                      key={ci}
                      className={`calendar-cell ${isToday ? "today-cell" : ""}`}
                    >
                      <div className="cell-top">
                        <button
                          className="cell-add-btn"
                          onClick={() =>
                            cell.isCurrentMonth && handleOpenDrawage(cell.day)
                          }
                        >
                          <PlusIcon />
                        </button>
                        <div
                          className={`cell-day-number ${!cell.isCurrentMonth ? "out-of-month" : ""} ${isToday ? "today-number" : ""}`}
                        >
                          {isToday ? (
                            <span className="today-badge">{cell.day}</span>
                          ) : (
                            cell.day
                          )}
                        </div>
                      </div>

                      {/* 💡 5. 이벤트 비축 구역 내에 지정된 그림 바인더 구현 */}
                      <div className="cell-events">
                        {savedImage && (
                          <img src={savedImage} alt="기록 이미지" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 우측 하단 고정 연필 버튼 */}
      <button
        className="fab"
        onClick={() => {
          console.log("연필 버튼 클릭 - 기능 준비 중");
        }}
      >
        <PencilIcon />
      </button>

      {isMenuOpen && (
        <>
          <div
            className={`overlay ${isClosing ? "fade-out" : ""}`}
            onClick={handleCloseMenu}
          />
          <div className={`side-menu ${isClosing ? "closing" : ""}`}>
            <div className="side-menu-header">
              <span className="side-menu-title">DADO Menu</span>
              <button className="close-btn" onClick={handleCloseMenu}>
                <CloseIcon />
              </button>
            </div>
            <div className="menu-items-container">
              <div className="side-menu-item">
                <span className="menu-item-icon">👤</span> 마이페이지
              </div>
              <div className="side-menu-item">
                <span className="menu-item-icon">🎨</span> 내 갤러리
              </div>
              <div className="side-menu-item">
                <span className="menu-item-icon">⚙️</span> 설정
              </div>
              <div className="side-menu-item danger">
                <span className="menu-item-icon">🚪</span> 로그아웃
              </div>
            </div>
          </div>
        </>
      )}

      {/* 날짜 가이드 상세 페이지 */}
      <SelectDrawage
        isOpen={isDrawageOpen}
        onClose={() => setIsDrawageOpen(false)}
        selectedDate={targetDate}
        // 💡 6. 하위 상세 모달에서 그림 그리기 트리거를 작동시켰을 때 처리할 콜백 가교 개설
        // 만약 selectDrawpage 컴포넌트에 이 프롭스를 보낼 버튼 처리가 필요하다면 연동해두시면 좋습니다.
        onGoToPaint={() => {
          setIsDrawageOpen(false);
          setIsPaintOpen(true);
        }}
      />

      {/* 💡 7. 그림판을 화면 정중앙에 띄워줄 모달 프레임 마크업 장착 */}
      {isPaintOpen && (
        <div
          className="paint-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <div
            className="paint-modal-content"
            style={{
              backgroundColor: "#ffffff",
              padding: "16px 20px 20px",
              borderRadius: "16px",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              width: "min(96vw, 1400px)",
              maxHeight: "96vh",
              overflow: "auto",
            }}
          >
            {/* 상단 레이어 닫기 버튼 */}
            <button
              onClick={() => setIsPaintOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: "#999",
              }}
            >
              ✕
            </button>

            {/* 그림판 주입 컴포넌트 호출 */}
            <DrawingWithPaint
              onInsert={handleSaveDrawing}
              selectedDate={targetDate}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}
    </div>
  );
}
