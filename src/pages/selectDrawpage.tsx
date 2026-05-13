import React from "react";
import "../css/selectDrawpage.css";

// 아이콘 컴포넌트
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

interface SelectDrawageProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

export default function SelectDrawage({
  isOpen,
  onClose,
  selectedDate,
}: SelectDrawageProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="select-drawage-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <h2 className="modal-title">어떤 방법으로 그려볼까요?</h2>

        <div className="draw-options-container">
          <button
            className="draw-option-card ai-option"
            onClick={() => alert(`${selectedDate} AI 그리기 선택`)}
          >
            <div className="card-content">
              <span className="card-emoji">✨</span>
              <span className="card-label">AI로 그리기</span>
              <p className="card-desc">설명만 입력하면 AI가 그려줘요</p>
            </div>
          </button>

          <div className="card-divider" />

          <button
            className="draw-option-card paint-option"
            onClick={() => alert(`${selectedDate} 직접 그리기 선택`)}
          >
            <div className="card-content">
              <span className="card-emoji">🎨</span>
              <span className="card-label">그림판으로 그리기</span>
              <p className="card-desc">직접 나만의 그림을 그려보아요</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
