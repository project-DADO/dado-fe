import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/selectDrawpage.css";
import { useDrawingsStore } from "../store/drawings-store";

// 닫기 아이콘
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
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

// AI 로봇 아이콘 (SVG)
const RobotIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2V5M12 5C15.3137 5 18 7.68629 18 11V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V11C6 7.68629 8.68629 5 12 5Z"
      stroke="#4A90E2"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 11H9.01M15 11H15.01"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 15C10 15 11 16 12 16C13 16 14 15 14 15"
      stroke="#4A90E2"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 13V15M22 13V15"
      stroke="#4A90E2"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="2" r="1" fill="#4A90E2" />
  </svg>
);

interface SelectDrawageProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onGoToPaint?: () => void;
}

export default function SelectDrawage({
  isOpen,
  onClose,
  selectedDate,
  onGoToPaint,
}: SelectDrawageProps) {
  const navigate = useNavigate();
  const setTargetDate = useDrawingsStore((s) => s.setTargetDate);

  if (!isOpen) return null;

  const handleGoToPaint = () => {
    onClose();
    setTargetDate(selectedDate);

    if (onGoToPaint) {
      onGoToPaint();
      return;
    }

    navigate("/drawing-paint", { state: { date: selectedDate } });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="select-drawage-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <h2 className="modal-title">원하는 방식으로 그림을 삽입해보세요</h2>

        <div className="draw-options-container">
          <button
            className="draw-option-card ai-option"
            onClick={() => alert(`${selectedDate} AI 그리기 선택`)}
          >
            <div className="card-content">
              <div className="card-icon">
                <RobotIcon />
              </div>
              <span className="card-label">AI로 그리기</span>
              <p className="card-desc">
                그림을 못 그려도 괜찮아요.
                <br />
                AI가 대신 그려줘요
              </p>
            </div>
          </button>

          <div className="card-divider" />

          {/* 💡 onClick 핸들러를 새로 만든 handleGoToPaint로 교체했습니다 */}
          <button
            className="draw-option-card paint-option"
            onClick={handleGoToPaint}
          >
            <div className="card-content">
              <span className="card-emoji">🎨</span>
              <span className="card-label">그림판으로 그리기</span>
              <p className="card-desc">
                직접 자유롭게
                <br />
                그려보세요
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
